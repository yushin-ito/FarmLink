import { Box } from "native-base";
import React, { memo, useEffect, useState } from "react";
import { Image, ImageURISource, useWindowDimensions } from "react-native";

type AutoHeightImageProps = {
  ratio: number;
  source: ImageURISource;
};

const AutoHeightImage = memo(
  ({ ratio, source, ...props }: AutoHeightImageProps) => {
    const [height, setHeight] = useState(0);
    const { width } = useWindowDimensions();

    useEffect(() => {
      if (source?.uri) {
        Image.getSize(source.uri, (originalWidth, originalHeight) => {
          const newHeight = (width * ratio * originalHeight) / originalWidth;
          setHeight(newHeight);
        });
      }
    }, [source, width]);

    return (
      <Box w={width * ratio} h={height} bg="muted.300" rounded="xl" {...props}>
        <Image source={source} style={{ flex: 1, borderRadius: 9 }} />
      </Box>
    );
  }
);

export default AutoHeightImage;
