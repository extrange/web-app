import React from 'react';
import styled from "styled-components";

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

export const GoogleBookResult = props => {

    return <Card onClick={props.onClick}>
        <Header>Google</Header>
        <Image><img src={props.image_url} alt='Loading...'/></Image>
        <Title>{props.title} ({props.published})</Title>
        <Authors>by {props.authors.map(e => `${e}, `)}</Authors>
        <Description>{props.description}</Description>
    </Card>;
};

export const GoodreadsBookResult = props => {
    return <Card onClick={props.onClick}>
        <Header>Goodreads</Header>
        <Image><img src={props.image_url} alt='Loading...'/></Image>
        <Title>{props.title} {props.published && `(${props.published})`}</Title>
        <Authors>by {props.authors.map(e => `${e}, `)}</Authors>
    </Card>
};
