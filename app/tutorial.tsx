import React, { useRef } from 'react';
import { Animated, ImageStyle, StyleSheet, View } from 'react-native';

type FadeInImageProps = React.ComponentProps<typeof Animated.Image>;

function FadeIn(props: FadeInImageProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.Image
      onLoad={onLoad}
      {...props}
      style={[
        {
          opacity,
          transform: [
            {
              scale: opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0.85, 1],
              }),
            },
          ],
        },
        props.style as ImageStyle,
      ]}
    />
  );
}

const Tutorial = () => (
  <View style={styles.container}>
    <FadeIn
      style={styles.image}
      source={require('@/assets/images/icon.png')}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
});

export default Tutorial;
