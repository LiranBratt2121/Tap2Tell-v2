import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  max-width: 64rem;
  margin: 0 auto;
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  padding: 1rem 1.5rem 0.5rem;
  border-bottom: 1px solid #f0f0f0;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

export const CardContent = styled.div`
  padding: 1.5rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export const DataItem = styled.div`
  margin-bottom: 0.5rem;
`;

export const Label = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
`;

export const Value = styled.p<{large?: boolean}>`
  font-weight: 500;
  margin: 0;
  color: #111827;
  ${props => props.large && `
    font-size: 1.5rem;
    font-weight: 600;
  `}
`;

export const ProgressContainer = styled.div`
  margin-bottom: 1.5rem;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  border-radius: 9999px;
  background-color: #2563eb;
`;

export const ProgressValue = styled.p`
  text-align: right;
  font-weight: 500;
  margin: 0.25rem 0 0 0;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: #f3f4f6;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
`;

export const TableHeaderCell = styled.th`
  text-align: ${props => props.align || 'left'};
  padding: 0.75rem;
  font-weight: 500;
  color: #374151;
`;

export const TableCell = styled.td< { bold?: boolean } >`
  padding: 0.75rem;
  text-align: ${props => props.align || 'left'};
  color: #111827;
  font-weight: ${props => props.bold ? "500" : "400"};
`;