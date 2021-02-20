import styled from "styled-components";
import {capitalize} from "lodash"

const Card = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 400px;
    border: 2px solid black;
    border-radius: 10px;
    margin: 5px;
    padding: 5px;
    cursor: pointer;
`;

const Header = styled.div`
    text-align: right;
    color: grey;
    font-size: smaller;
    flex-shrink: 0;
`;

const Image = styled.div`
    display: flex;
    justify-content: center;
    height: 200px;
    flex-shrink: 0;
`;

const Title = styled.div`
    font-weight: bold;
    text-align: center;
    overflow: hidden;
    flex-shrink: 0;
`;

const Authors = styled.div`
    flex-shrink: 0;
    text-align: center;
    font-style: italic;
`;

const Description = styled.div`
    overflow: hidden;
    text-align: justify;
    text-justify: auto;
`;

export const BookResult = ({handleClick, result}) => {

    return <Card onClick={handleClick}>
        <Header>{capitalize(result.from)}</Header>
        <Image><img src={result.image_url} alt={'Loading'}/></Image>
        <Title>{result.title} {result.published ? `(${result.published})`: null}</Title>
        <Authors>by {result.authors?.map(e => `${e},`)}</Authors>
        <Description>{result.description}</Description>
    </Card>
};
