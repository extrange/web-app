import styled from "styled-components";
import { capitalize } from "lodash"
import { Button, Card, CardActionArea, CardActions, CardContent, CircularProgress, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";


const StyledCard = styled(Card)`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledCardContent = styled(CardContent)`
  height: 100%;
`;

const Description = styled(CardContent)`
  display: ${({ $empty }) => $empty ? 'flex' : 'block'};
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  height: ${({ $maxHeight }) => `${$maxHeight}px` || 'initial'};
`;

const StyledActionArea = styled(CardActionArea)`
  height: 100%;
`;

const Image = styled.img`
  height: 200px;
`

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  height: 200px;
`;
const Title = styled(Typography)`
  line-height: 1rem;
`;

const Authors = styled(Typography)`
  font-style: italic;
`;

export const BookResult = ({ onSearchResultClick, result, searchLoading }) => {
  let { authors = [], from, image_url, published, title, description } = result;

  const [detailView, setDetailView] = useState(false);
  const [maxHeight, setMaxHeight] = useState();
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    setLoading(true);
    onSearchResultClick(result)
  };

  useEffect(() => void setDetailView(false), [result]);

  return <StyledCard>
    <StyledActionArea onClick={() => setDetailView(!detailView)}>
      {detailView ?
        <Description $maxHeight={maxHeight} $empty={!Boolean(description)}>
          <Typography variant={'body2'}>{description ? description : 'No description provided'}</Typography>
        </Description> :
        <StyledCardContent ref={ref => ref && setMaxHeight(ref.offsetHeight)}>
          <Typography align={'right'} color={'textSecondary'} variant={'body2'}>{capitalize(from)}</Typography>
          <ImageContainer>{image_url ?
            <Image src={image_url} alt={''} /> :
            <Typography variant={'body2'}>No cover</Typography>}</ImageContainer>
          <Title align={'center'} variant={'subtitle2'}>{title} {published ? `(${published})` : null}</Title>
          <Authors align={'center'} variant={'body2'}>{authors.length ? authors.reduce((acc, cur) => acc + `, ${cur}`) : ''}</Authors>
        </StyledCardContent>}
    </StyledActionArea>
    <CardActions>
      <Button onClick={onClick} disabled={searchLoading}>Select</Button>
      {loading && <CircularProgress size={20} />}
    </CardActions>
  </StyledCard>
};
