type Args = {
  input: number;
  inputRange: number[];
  outputRange: number[];
};

export const mapToRange = ({ input, inputRange, outputRange }: Args): number => {
  if (input < inputRange[0] || input > inputRange[1]) {
    throw new Error('Input value is out of range.');
  }

  const output =
    ((input - inputRange[0]) / (inputRange[1] - inputRange[0])) *
      (outputRange[1] - outputRange[0]) +
    outputRange[0];

  return output;
};
