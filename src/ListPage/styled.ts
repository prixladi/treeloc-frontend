import styled from 'styled-components';
import { Input } from 'antd';

export const ResponsiveSearch = styled(Input.Search)`
  width: 40%;
  margin-top: 0.2em;
  margin-left: 0.2em;
  margin-right: 0.2em;
  @media (max-width: 1300px) {
    width: 55%;
  }
  @media (max-width: 1000px) {
    width: 75%;
  }
  @media (max-width: 500px) {
    width: 98%;
  }
`;