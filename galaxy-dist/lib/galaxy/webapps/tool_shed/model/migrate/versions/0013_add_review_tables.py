"""
Migration script to add the repository_review, component_review and component tables and the Repository Reviewer group and role.
"""
import datetime, logging, sys
from sqlalchemy import *
from sqlalchemy.orm import *
from migrate import *
from migrate.changeset import *
# Need our custom types, but don't import anything else from model
from galaxy.model.custom_types import *

log = logging.getLogger( __name__ )
log.setLevel(logging.DEBUG)
handler = logging.StreamHandler( sys.stdout )
format = "%(name)s %(levelname)s %(asctime)s %(message)s"
formatter = logging.Formatter( format )
handler.setFormatter( formatter )
log.addHandler( handler )

metadata = MetaData( migrate_engine )
db_session = scoped_session( sessionmaker( bind=migrate_engine, autoflush=False, autocommit=True ) )

IUC = 'Intergalactic Utilities Commission'
NOW = datetime.datetime.utcnow
REVIEWER = 'Repository Reviewer'
ROLE_TYPE = 'system'

def nextval( table, col='id' ):
    if migrate_engine.name == 'postgres':
        return "nextval('%s_%s_seq')" % ( table, col )
    elif migrate_engine.name == 'mysql' or migrate_engine.name == 'sqlite':
        return "null"
    else:
        raise Exception( 'Unable to convert data for unknown database type: %s' % migrate_engine.name )

def localtimestamp():
   if migrate_engine.name == 'postgres' or migrate_engine.name == 'mysql':
       return "LOCALTIMESTAMP"
   elif migrate_engine.name == 'sqlite':
       return "current_date || ' ' || current_time"
   else:
       raise Exception( 'Unable to convert data for unknown database type: %s' % db )

def boolean_false():
   if migrate_engine.name == 'postgres' or migrate_engine.name == 'mysql':
       return False
   elif migrate_engine.name == 'sqlite':
       return 0
   else:
       raise Exception( 'Unable to convert data for unknown database type: %s' % db ) 

RepositoryReview_table = Table( "repository_review", metadata,
    Column( "id", Integer, primary_key=True ),
    Column( "create_time", DateTime, default=NOW ),
    Column( "update_time", DateTime, default=NOW, onupdate=NOW ),
    Column( "repository_id", Integer, ForeignKey( "repository.id" ), index=True ),
    Column( "changeset_revision", TrimmedString( 255 ), index=True ),
    Column( "user_id", Integer, ForeignKey( "galaxy_user.id" ), index=True, nullable=False ),
    Column( "approved", TrimmedString( 255 ) ),
    Column( "rating", Integer, index=True ),
    Column( "deleted", Boolean, index=True, default=False ) )

ComponentReview_table = Table( "component_review", metadata,
    Column( "id", Integer, primary_key=True ),
    Column( "create_time", DateTime, default=NOW ),
    Column( "update_time", DateTime, default=NOW, onupdate=NOW ),
    Column( "repository_review_id", Integer, ForeignKey( "repository_review.id" ), index=True ),
    Column( "component_id", Integer, ForeignKey( "component.id" ), index=True ),
    Column( "comment", TEXT ),
    Column( "private", Boolean, default=False ),
    Column( "approved", TrimmedString( 255 ) ),
    Column( "rating", Integer ),
    Column( "deleted", Boolean, index=True, default=False ) )

Component_table = Table( "component", metadata,
    Column( "id", Integer, primary_key=True ),
    Column( "name", TrimmedString( 255 ) ),
    Column( "description", TEXT ) )

def upgrade():
    print __doc__
    metadata.reflect()
    # Create new review tables.
    try:
        Component_table.create()
    except Exception, e:
        print str(e)
        log.debug( "Creating component table failed: %s" % str( e ) )
    try:
        RepositoryReview_table.create()
    except Exception, e:
        print str(e)
        log.debug( "Creating repository_review table failed: %s" % str( e ) )
    try:
        ComponentReview_table.create()
    except Exception, e:
        print str(e)
        log.debug( "Creating component_review table failed: %s" % str( e ) )
    # Insert default Component values.
    names = [ 'Data types', 'Functional tests', 'README', 'Tool dependencies', 'Tools', 'Workflows' ]
    descriptions = [ 'Proprietary datatypes defined in a file named datatypes_conf.xml included in the repository',
                     'Functional tests defined in each tool config included in the repository along with test data files',
                     'An appropriately named file included in the repository that contains installation information or 3rd-party tool dependency licensing information',
                     'Tool dependencies defined in a file named tool_dependencies.xml included in the repository for contained tools',
                     'Galaxy tools included in the repository',
                     'Exported Galaxy workflows included in the repository' ]
    for tup in zip( names, descriptions ):
        name, description = tup
        cmd = "INSERT INTO component VALUES ("
        cmd += "%s, " % nextval( 'component' )
        cmd += "'%s', " % name
        cmd += "'%s' " % description
        cmd += ");"
        db_session.execute( cmd )
    # Insert a REVIEWER role into the role table.
    cmd = "INSERT INTO role VALUES ("
    cmd += "%s, " % nextval( 'role' )
    cmd += "%s, " % localtimestamp()
    cmd += "%s, " % localtimestamp()
    cmd += "'%s', " % REVIEWER
    cmd += "'A user or group member with this role can review repositories.', "
    cmd += "'%s', " % ROLE_TYPE
    cmd += "%s" % boolean_false()
    cmd += ");"
    db_session.execute( cmd )
    # Get the id of the REVIEWER role.
    cmd = "SELECT id FROM role WHERE name = '%s' and type = '%s';" % ( REVIEWER, ROLE_TYPE )
    row = db_session.execute( cmd ).fetchone()
    if row:
        role_id = row[ 0 ]
    else:
        role_id = None
    # Insert an IUC group into the galaxy_group table.
    cmd = "INSERT INTO galaxy_group VALUES ("
    cmd += "%s, " % nextval( 'galaxy_group' )
    cmd += "%s, " % localtimestamp()
    cmd += "%s, " % localtimestamp()
    cmd += "'%s', " % IUC
    cmd += "%s" % boolean_false()
    cmd += ");"
    db_session.execute( cmd )
    # Get the id of the IUC group.
    cmd = "SELECT id FROM galaxy_group WHERE name = '%s';" % ( IUC )
    row = db_session.execute( cmd ).fetchone()
    if row:
        group_id = row[ 0 ]
    else:
        group_id = None
    if group_id and role_id:
        # Insert a group_role_association for the IUC group and the REVIEWER role.
        cmd = "INSERT INTO group_role_association VALUES ("
        cmd += "%s, " % nextval( 'group_role_association' )
        cmd += "%d, " % int( group_id )
        cmd += "%d, " % int( role_id )
        cmd += "%s, " % localtimestamp()
        cmd += "%s " % localtimestamp()
        cmd += ");"
        db_session.execute( cmd )

def downgrade():
    metadata.reflect()
    # Drop review tables.
    try:
        ComponentReview_table.drop()
    except Exception, e:
        print str(e)
        log.debug( "Dropping component_review table failed: %s" % str( e ) )
    try:
        RepositoryReview_table.drop()
    except Exception, e:
        print str(e)
        log.debug( "Dropping repository_review table failed: %s" % str( e ) )
    try:
        Component_table.drop()
    except Exception, e:
        print str(e)
        log.debug( "Dropping component table failed: %s" % str( e ) )
    # Get the id of the REVIEWER group.
    cmd = "SELECT id FROM galaxy_group WHERE name = '%s';" % ( IUC )
    row = db_session.execute( cmd ).fetchone()
    if row:
        group_id = row[ 0 ]
    else:
        group_id = None
    # Get the id of the REVIEWER role.
    cmd = "SELECT id FROM role WHERE name = '%s' and type = '%s';" % ( REVIEWER, ROLE_TYPE )
    row = db_session.execute( cmd ).fetchone()
    if row:
        role_id = row[ 0 ]
    else:
        role_id = None
    # See if we have at least 1 user
    cmd = "SELECT * FROM galaxy_user;"
    users = db_session.execute( cmd ).fetchall()
    if role_id:
        if users:
            # Delete all UserRoleAssociations for the REVIEWER role.
            cmd = "DELETE FROM user_role_association WHERE role_id = %d;" % int( role_id )
            db_session.execute( cmd )
        if group_id:
            # Delete all UserGroupAssociations for members of the IUC group.
            cmd = "DELETE FROM user_group_association WHERE group_id = %d;" % int( group_id )
            db_session.execute( cmd )
            # Delete all GroupRoleAssociations for the IUC group and the REVIEWER role.
            cmd = "DELETE FROM group_role_association WHERE group_id = %d and role_id = %d;" % ( int( group_id ), int( role_id ) )
            db_session.execute( cmd )
            # Delete the IUC group from the galaxy_group table.
            cmd = "DELETE FROM galaxy_group WHERE id = %d;" % int( group_id )
            db_session.execute( cmd )
        # Delete the REVIEWER role from the role table.
        cmd = "DELETE FROM role WHERE id = %d;" % int( role_id )
        db_session.execute( cmd )
