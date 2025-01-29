import Image, { ImageProps } from "next/image";

const ClickableImage = (props: ImageProps): JSX.Element => (
  <Image role="button" {...props} />
);

export default ClickableImage;
