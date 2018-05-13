export const getCoordsFromAreaWindow = ({ leftTopX, leftTopY, rightBottomX, rightBottomY }) => {
    return { 
        leftTopX: (leftTopX + 18),
        leftTopY: (leftTopY + 3),
        rightBottomX: (rightBottomX - 3),
        rightBottomY: (rightBottomY - 3)
    };
}