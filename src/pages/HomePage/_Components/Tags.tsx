import styled from "styled-components";

const Tags = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    font-size: 13px;
    color: #fff;
    background-color: #6080d2;
    
    @media (max-width: 800px) {
        flex-direction: column;
    }
`;

export const List = styled.ul`
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
    
    @media (max-width: 800px) {
        flex-direction: column;
        text-align: center;
    }
`;

export const ListItem = styled.li`
    font-weight: 600;
    padding: 0 5px;
`;

export default Tags;
