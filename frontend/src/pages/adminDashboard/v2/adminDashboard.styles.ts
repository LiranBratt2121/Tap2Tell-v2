import styled from "styled-components";

const DashboardContainer = styled.div`
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 1.1rem;
  margin: 0;
  text-align: center;
`;

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin: 16px auto;
  display: block;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const MetricCard = styled.div<{ accent?: string }>`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-left: 4px solid ${props => props.accent || '#667eea'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetricDescription = styled.div`
  font-size: 0.85rem;
  color: #a0aec0;
  margin-top: 4px;
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 32px 0 16px 0;
  text-align: center;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const ChartTitle = styled.h3`
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  text-align: center;
`;

const LetterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const LetterCard = styled.div<{ performance: 'good' | 'average' | 'poor' }>`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  border-left: 4px solid ${props =>
    props.performance === 'good' ? '#48bb78' :
      props.performance === 'average' ? '#ed8936' : '#f56565'
  };
`;

const LetterName = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 8px;
`;

const LetterStats = styled.div`
  font-size: 0.85rem;
  color: #718096;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #718096;
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
`;

const TrendsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TrendItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f7fafc;
  border-radius: 8px;
  border-right: 4px solid #e2e8f0;
`;

const TrendDate = styled.span`
  font-weight: 500;
  color: #2d3748;
`;

const TrendValue = styled.span`
  font-weight: 600;
  color: #667eea;
`;

const SearchContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
    margin: 24px auto; /* Center the search bar horizontally */
    padding: 16px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    max-width: 700px; /* Limit max width for better appearance */
    flex-wrap: wrap; /* Allow items to wrap on smaller screens */
`;

const SearchInput = styled.input`
    flex-grow: 1; /* Allows input to take available space */
    min-width: 250px; /* Minimum width before wrapping */
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    color: #2d3748;
    text-align: right; /* Ensure input text is RTL */

    &::placeholder {
        color: #a0aec0;
        opacity: 1; /* Ensure placeholder is visible */
        text-align: right; /* Ensure placeholder is RTL */
    }

    &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &:disabled {
        background-color: #f7fafc;
        cursor: not-allowed;
    }
`;

// Reuse the RefreshButton style but adjust margins if needed
const SearchButton = styled(RefreshButton)`
    margin: 0; /* Remove auto margin from RefreshButton */
    display: inline-block; /* Override block display if necessary */
    padding: 12px 24px; /* Adjust padding slightly if desired */
    height: fit-content; /* Adjust height to fit content */
`;

const UserResultsContainer = styled.div`
    margin-top: 40px;
    padding: 24px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
`;

// Reuse the MetricCard style but give different border colors
const UserInfoCard = styled(MetricCard)`
    border-right-color: #4299e1; /* Blue accent for info */
    margin-bottom: 24px; /* Space between cards */
`;

const UserActivityCard = styled(MetricCard)`
     border-right-color: #ed8936; /* Orange accent for activity */
    margin-bottom: 24px; /* Space between cards */
`;

const UserLettersCard = styled(MetricCard)`
     border-right-color: #48bb78; /* Green accent for letters */
    margin-bottom: 24px; /* Space between cards */

     ${MetricLabel} {
        margin-bottom: 16px; /* Add space below label before the letter grid */
    }
`;

// Reuse the LetterGrid and LetterCard styles for the user-specific display
const UserLetterGrid = styled(LetterGrid)`
    margin-bottom: 0; /* Remove default bottom margin from LetterGrid */
`;

const UserLetterCard = styled(LetterCard)`
    padding: 12px; /* Slightly smaller padding for individual user letters */
`;
export {
  DashboardContainer,
  Header,
  Title,
  Subtitle,
  RefreshButton,
  MetricsGrid,
  MetricCard,
  MetricValue,
  MetricLabel,
  MetricDescription,
  SectionTitle,
  ChartsContainer,
  ChartCard,
  ChartTitle,
  LetterGrid,
  LetterCard,
  LetterName,
  LetterStats,
  LoadingSpinner,
  ErrorMessage,
  TrendsList,
  TrendItem,
  TrendDate,
  TrendValue,
  // Search components
  SearchContainer,
  SearchInput,
  SearchButton,
  UserResultsContainer,
  UserInfoCard,
  UserActivityCard,
  UserLettersCard,
  UserLetterGrid,
  UserLetterCard
};