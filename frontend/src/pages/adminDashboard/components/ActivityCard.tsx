import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Grid,
    DataItem,
    Label,
    Value,
    Table,
    TableHead,
    TableHeaderCell,
    TableRow,
    TableCell
} from '../adminDashboard.styles';
import { calculateAverageTime, formatDate, formatTime } from '../utils';
import { UserActivityData } from '../adminDashboard.types';

const ActivityCard = (userData: UserActivityData) => {
    // Sort daily times by date (most recent first)
    const sortedDailyTimes = Object.entries(userData.dailyTimes || {})
        .sort((a, b) => b[0].localeCompare(a[0]))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Metrics</CardTitle>
            </CardHeader>
            <CardContent>
                <Grid>
                    <DataItem>
                        <Label>Total Active Time</Label>
                        <Value large>{formatTime(userData.totalActiveTime)}</Value>
                    </DataItem>
                    <DataItem>
                        <Label>Average Daily Time</Label>
                        <Value large>{formatTime(calculateAverageTime(sortedDailyTimes))}</Value>
                    </DataItem>
                    <DataItem>
                        <Label>User Since</Label>
                        <Value>{userData.createdAt}</Value>
                    </DataItem>
                    <DataItem>
                        <Label>Last Active</Label>
                        <Value>{userData.lastUpdated}</Value>
                    </DataItem>
                </Grid>

                <div style={{ marginTop: '1.5rem' }}>
                    <Label>Recent Activity</Label>
                    <div style={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>Date</TableHeaderCell>
                                    <TableHeaderCell align="right">Time Active</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <tbody>
                                {sortedDailyTimes.length > 0 ? (
                                    sortedDailyTimes.map(([date, seconds]) => (
                                        <TableRow key={date}>
                                            <TableCell bold>{formatDate(date)}</TableCell>
                                            <TableCell align="right">{formatTime(seconds)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} style={{ textAlign: 'center' }}>No recent activity data</TableCell>
                                    </TableRow>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ActivityCard;