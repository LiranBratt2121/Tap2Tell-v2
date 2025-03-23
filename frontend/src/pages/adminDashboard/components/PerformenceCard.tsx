import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Label,
    ProgressContainer,
    ProgressBar,
    ProgressFill,
    ProgressValue,
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableCell
} from '../adminDashboard.styles';
import { LettersData } from '../adminDashboard.types';
import { calculateOverallAccuracy } from '../utils';

interface PerformanceCardProps {
    userData: LettersData;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ userData }) => {
    const accuracy = calculateOverallAccuracy(userData);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
                <ProgressContainer>
                    <Label>Overall Accuracy</Label>
                    <ProgressBar>
                        <ProgressFill style={{ width: `${accuracy}%` }} />
                    </ProgressBar>
                    <ProgressValue>{accuracy}%</ProgressValue>
                </ProgressContainer>

                <div>
                    <Label>Letter Performance</Label>
                    <div style={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>Letter</TableHeaderCell>
                                    <TableHeaderCell align="center">Accuracy</TableHeaderCell>
                                    <TableHeaderCell align="center">Correct</TableHeaderCell>
                                    <TableHeaderCell align="center">Total</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <tbody>
                                {Object.entries(userData).map(([letter, data]) => (
                                    <TableRow key={letter}>
                                        <TableCell bold={true}>{letter}</TableCell>
                                        <TableCell align="center">{data.accuracy}%</TableCell>
                                        <TableCell align="center">{data.correct}</TableCell>
                                        <TableCell align="center">{data.total}</TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PerformanceCard;