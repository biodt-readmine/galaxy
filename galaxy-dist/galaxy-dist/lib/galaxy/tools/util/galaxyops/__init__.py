"""Utility functions for galaxyops"""
import sys
from bx.bitset import *
from bx.intervals.io import *

def warn( msg ):
    # TODO: since everything printed to stderr results in job.state = error, we
    # don't need both a warn and a fail...
    print >> sys.stderr, msg
    sys.exit( 1 )
    
def fail( msg ):
    print >> sys.stderr, msg
    sys.exit( 1 )

# Default chrom, start, end, strand cols for a bed file
BED_DEFAULT_COLS = 0, 1, 2, 5

def parse_cols_arg( cols ):
    """Parse a columns command line argument into a four-tuple"""
    if cols:
        # Handle case where no strand column included - in this case, cols
        # looks something like 1,2,3,
        if cols.endswith( ',' ):
            cols += '0'
        col_list = map( lambda x: int( x ) - 1, cols.split(",") )
        return col_list
    else:
        return BED_DEFAULT_COLS

def default_printer( stream, exc, obj ):
    print >> stream, "%d: %s" % ( obj.linenum, obj.current_line )
    print >> stream, "\tError: %s" % ( str(exc) )

def skipped( reader, filedesc="" ):
    first_line, line_contents, problem = reader.skipped_lines[0]
    return 'Skipped %d invalid lines%s, 1st line #%d: "%s", problem: %s' % ( reader.skipped, filedesc, first_line, line_contents, problem )
