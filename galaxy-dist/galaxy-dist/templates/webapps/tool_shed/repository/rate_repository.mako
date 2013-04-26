<%namespace file="/message.mako" import="render_msg" />
<%namespace file="/webapps/tool_shed/common/common.mako" import="*" />
<%namespace file="/webapps/tool_shed/repository/common.mako" import="*" />

<%
    from galaxy.web.framework.helpers import time_ago
    from urllib import quote_plus
    is_admin = trans.user_is_admin()
    is_new = repository.is_new( trans.app )
    can_contact_owner = trans.user and trans.user != repository.user
    can_push = trans.app.security_agent.can_push( trans.app, trans.user, repository )
    can_upload = can_push
    can_download = not is_new and ( not is_malicious or can_push )
    can_browse_contents = not is_new
    can_rate = repository.user != trans.user
    can_manage = is_admin or repository.user == trans.user
    can_view_change_log = not is_new
    if can_push:
        browse_label = 'Browse or delete repository tip files'
    else:
        browse_label = 'Browse repository tip files'
    has_readme = metadata and 'readme' in metadata
%>

<%!
   def inherit(context):
       if context.get('use_panels'):
           return '/webapps/tool_shed/base_panels.mako'
       else:
           return '/base.mako'
%>
<%inherit file="${inherit(context)}"/>

<%def name="stylesheets()">
    ${parent.stylesheets()}
    ${h.css('base','panel_layout','jquery.rating')}
</%def>

<%def name="javascripts()">
    ${parent.javascripts()}
    ${h.js( "libs/jquery/jquery.rating" )}
</%def>

%if message:
    ${render_msg( message, status )}
%endif

<br/><br/>
<ul class="manage-table-actions">
    %if is_new:
        <a class="action-button" href="${h.url_for( controller='upload', action='upload', repository_id=trans.security.encode_id( repository.id ) )}">Upload files to repository</a>
    %else:
        <li><a class="action-button" id="repository-${repository.id}-popup" class="menubutton">Repository Actions</a></li>
        <div popupmenu="repository-${repository.id}-popup">
            %if can_manage:
                <a class="action-button" href="${h.url_for( controller='repository', action='manage_repository', id=trans.app.security.encode_id( repository.id ), changeset_revision=repository.tip( trans.app ) )}">Manage repository</a>
            %else:
                <a class="action-button" href="${h.url_for( controller='repository', action='view_repository', id=trans.app.security.encode_id( repository.id ), changeset_revision=repository.tip( trans.app ) )}">View repository</a>
            %endif
            %if can_upload:
                <a class="action-button" href="${h.url_for( controller='upload', action='upload', repository_id=trans.security.encode_id( repository.id ) )}">Upload files to repository</a>
            %endif
            %if can_view_change_log:
                <a class="action-button" href="${h.url_for( controller='repository', action='view_changelog', id=trans.app.security.encode_id( repository.id ) )}">View change log</a>
            %endif
            %if can_browse_contents:
                <a class="action-button" href="${h.url_for( controller='repository', action='browse_repository', id=trans.app.security.encode_id( repository.id ) )}">${browse_label | h}</a>
            %endif
            %if can_contact_owner:
                <a class="action-button" href="${h.url_for( controller='repository', action='contact_owner', id=trans.security.encode_id( repository.id ) )}">Contact repository owner</a>
            %endif
            %if can_download:
                <a class="action-button" href="${h.url_for( controller='repository', action='download', repository_id=trans.app.security.encode_id( repository.id ), changeset_revision=repository.tip( trans.app ), file_type='gz' )}">Download as a .tar.gz file</a>
                <a class="action-button" href="${h.url_for( controller='repository', action='download', repository_id=trans.app.security.encode_id( repository.id ), changeset_revision=repository.tip( trans.app ), file_type='bz2' )}">Download as a .tar.bz2 file</a>
                <a class="action-button" href="${h.url_for( controller='repository', action='download', repository_id=trans.app.security.encode_id( repository.id ), changeset_revision=repository.tip( trans.app ), file_type='zip' )}">Download as a zip file</a>
            %endif
        </div>
    %endif
</ul>

%if repository.user != trans.user:
    <div class="toolForm">
        <div class="toolFormTitle">${repository.name | h}</div>
        %if can_download:
            <div class="form-row">
                <label>Clone this repository:</label>
                ${render_clone_str( repository )}
            </div>
        %endif
        <div class="toolFormBody">
            <div class="form-row">
                <label>Description:</label>
                ${repository.description | h}
                <div style="clear: both"></div>
            </div>
            <div class="form-row">
                <label>Version:</label>
                ${repository.revision( trans.app ) | h}
                <div style="clear: both"></div>
            </div>
            <div class="form-row">
                <label>Owner:</label>
                ${repository.user.username | h}
                <div style="clear: both"></div>
            </div>
        </div>
    </div>
    <p/>
    <div class="toolForm">
        <div class="toolFormTitle">Rate and Review</div>
        <div class="toolFormBody">
            <form id="rate_repository" name="rate_repository" action="${h.url_for( controller='repository', action='rate_repository', id=trans.security.encode_id( repository.id ) )}" method="post">
                <div class="form-row">
                    <label>Times Rated:</label>
                    ${num_ratings | h}
                    <div style="clear: both"></div>
                </div>
                <div class="form-row">
                    <label>Average Rating:</label>
                    ${render_star_rating( 'avg_rating', avg_rating, disabled=True )}
                    <div style="clear: both"></div>
                </div>
                <div class="form-row">
                    <label>Your Rating:</label>
                    <%
                        if rra and rra.rating:
                            rating = rra.rating
                        else:
                            rating = 0
                    %>
                    ${render_star_rating( 'rating', rating )}
                    <div style="clear: both"></div>
                </div>
                <div class="form-row">
                    <label>Review:</label>
                    %if rra and rra.comment:
                        <div class="form-row-input">
                            <pre><textarea name="comment" rows="5" cols="80">${rra.comment | h}</textarea></pre>
                        </div>
                    %else:
                        <div class="form-row-input">
                            <textarea name="comment" rows="5" cols="80"></textarea>
                        </div>
                    %endif
                    <div style="clear: both"></div>
                </div>
                <div class="form-row">
                    <input type="submit" name="rate_button" id="rate_button" value="Submit" />
                </div>
            </form>
        </div>
    </div>
    <p/>
    %if repository.ratings and ( len( repository.ratings ) > 1 or repository.ratings[0] != rra ):
        <div class="toolForm">
            <div class="toolFormBody">
                %if display_reviews:
                    <div class="form-row">
                        <a href="${h.url_for( controller='repository', action='rate_repository', id=trans.security.encode_id( repository.id ), display_reviews=False )}"><label>Hide Reviews</label></a>
                    </div>
                    <table class="grid">
                        <thead>
                            <tr>
                                <th>Rating</th>
                                <th>Comments</th>
                                <th>Reviewed</th>
                                <th>User</th>
                            </tr>
                        </thead>
                        <% count = 0 %>
                        %for review in repository.ratings:
                            <%
                                count += 1
                                name = 'rating%d' % count
                            %>
                            <tr>
                                <td>${render_star_rating( name, review.rating, disabled=True )}</td>
                                <td><pre>${review.comment | h}</pre></td>
                                <td>${time_ago( review.update_time )}</td>
                                <td>${review.user.username | h}</td>
                            </tr>
                        %endfor
                    </table>
                %else:
                    <div class="form-row">
                        <a href="${h.url_for( controller='repository', action='rate_repository', id=trans.security.encode_id( repository.id ), display_reviews=True )}"><label>Display Reviews</label></a>
                    </div>
                %endif
            </div>
        </div>
    %endif
%endif
