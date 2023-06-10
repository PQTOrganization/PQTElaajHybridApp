import { Typography } from '@mui/material';
import Skeleton from 'react-loading-skeleton';

const LoadingTypography = (props: any) => {
	const loading = props.loading ?? false;
	if (loading) return <Skeleton containerClassName="skeleton-container" />
	else return <Typography sx={{ fontSize: 14 }}>{props.text}</Typography>
};

export default LoadingTypography;
