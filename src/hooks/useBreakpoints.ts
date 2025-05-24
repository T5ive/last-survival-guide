import useMediaQuery from './useMediaQuery';

const useBreakpoints = () => {
    const isUnderSm = useMediaQuery('(max-width: 639px)');
    const isSm = useMediaQuery('(min-width: 640px)');
    const isMd = useMediaQuery('(min-width: 768px)');
    const isLg = useMediaQuery('(min-width: 1024px)');
    const isXl = useMediaQuery('(min-width: 1280px)');
    const is2xl = useMediaQuery('(min-width: 1536px)');

    return { isUnderSm, isSm, isMd, isLg, isXl, is2xl };
};

export default useBreakpoints;
