    import React, { useState, useCallback } from 'react';
    import {
    Dimensions,
    StyleSheet,
    View,
    Image,
    StatusBar,
    } from 'react-native';
    import { SafeAreaView } from 'react-native-safe-area-context';
    import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    } from 'react-native-gesture-handler';
    import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming,
    Extrapolate,
    Easing,
    } from 'react-native-reanimated';
    import { MaterialCommunityIcons } from '@expo/vector-icons';

    /* ================= TYPES ================= */
    type CardItem = {
    id: number;
    image: string;
    };

    type SwipeDirection = 'LEFT' | 'RIGHT';

    interface CardProps {
    item: CardItem;
    stackIndex: number;
    onSwipe: (direction: SwipeDirection) => void;
    }

    /* ================= CONFIG ================= */
    const { width, height } = Dimensions.get('window');
    const stackProgress = useSharedValue(0);

    const CARD_WIDTH = width * 0.7;
    const CARD_HEIGHT = height * 0.46;

    const SPRING_CONFIG = {
    damping: 200,  
    stiffness: 200, // Nilai rendah = gerakan tidak terlalu agresif
    mass: 1,
    overshootClamping: true, // INI KUNCINYA: Memaksa animasi berhenti saat sampai tujuan tanpa lewat sedikitpun
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    };

    const DATA: CardItem[] = [
    {
        id: 1,
        image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop', 
    },
    {
        id: 2,
        image:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop', // dark forest
    },
    {
        id: 3,
        image:
            'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=1200&auto=format&fit=crop', // night road
    },
    {
        id: 4,
        image:
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop', // dark lake
    },
    ];

    /* ================= CARD ================= */
    const Card: React.FC<CardProps> = ({ item, stackIndex, onSwipe }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const isTop = stackIndex === 0;

    /* 🔥 lift & scale REAL-TIME saat swipe */
    const liftY = useDerivedValue(() =>
        interpolate(
        Math.abs(translateX.value),
        [0, 150],
        [0, -22],
        Extrapolate.CLAMP
        )
    );

    const scaleOnSwipe = useDerivedValue(() =>
        interpolate(
        Math.abs(translateX.value),
        [0, 150],
        [1, 1.04],
        Extrapolate.CLAMP
        )
    );

    const progress = useDerivedValue(() =>
        interpolate(
        Math.abs(translateX.value),
        [0, 160],
        [0, 1],
        Extrapolate.CLAMP
        )
    );

    const gesture = Gesture.Pan()
        .enabled(isTop)
        .onUpdate((e) => {
        translateX.value = e.translationX;
        translateY.value = e.translationY;

        // 🔥 progress swipe global (0 → 1)
        stackProgress.value = interpolate(
            Math.abs(e.translationX),
            [0, 160],
            [0, 1],
            Extrapolate.CLAMP
            );
        })
        .onEnd((e) => {
        stackProgress.value = withTiming(0, { duration: 200 });
        const shouldSwipe =
            Math.abs(e.translationX) > 110 || Math.abs(e.velocityX) > 800;

        if (shouldSwipe) {
            const dir = e.translationX > 0 ? 1 : -1;

            translateX.value = withTiming(
            dir * width * 1.3,
            { duration: 320, easing: Easing.out(Easing.exp) },
            () => runOnJS(onSwipe)(dir > 0 ? 'RIGHT' : 'LEFT')
            );
        } else {
            translateX.value = withSpring(0, SPRING_CONFIG);
            translateY.value = withSpring(0, SPRING_CONFIG);
        }
        });

    const animatedStyle = useAnimatedStyle(() => {
        if (isTop) {
        const rotate = interpolate(
            translateX.value,
            [-width, 0, width],
            [-8, 0, 8],
            Extrapolate.CLAMP
        );

        return {
            transform: [
            { translateX: translateX.value },
            { translateY: translateY.value + liftY.value }, // 🔥 ikut naik
            { rotate: `${rotate}deg` },
            { scale: scaleOnSwipe.value }, // 🔥 ikut membesar
            ],
            zIndex: 100,
        };
        }

        return {
        transform: [
            {
                scale: interpolate(
                stackProgress.value,
                [0, 1],
                [1 - stackIndex * 0.07, 1 - (stackIndex - 1) * 0.07],
                Extrapolate.CLAMP
                ),
            },
            {
                translateY: interpolate(
                stackProgress.value,
                [0, 1],
                [stackIndex * 14, (stackIndex - 1) * 14],
                Extrapolate.CLAMP
                ),
            },
        ],
        opacity: interpolate(
            progress.value,
            [0, 1],
            [0.9 - stackIndex * 0.1, 0.9],
            Extrapolate.CLAMP
        ),
        zIndex: 10 - stackIndex,
        };
    });

    const xIconStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
        translateX.value,
        [-120, -40],
        [1, 0],
        Extrapolate.CLAMP
        ),
        transform: [
        {
            scale: interpolate(
            translateX.value,
            [-140, 0],
            [1.1, 0.7],
            Extrapolate.CLAMP
            ),
        },
        ],
    }));

    const loveIconStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
        translateX.value,
        [40, 120],
        [0, 1],
        Extrapolate.CLAMP
        ),
        transform: [
        {
            scale: interpolate(
            translateX.value,
            [0, 140],
            [0.7, 1.1],
            Extrapolate.CLAMP
            ),
        },
        ],
    }));

    return (
        <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
            <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.textOverlay}>
                <Animated.Text style={styles.cardText}>
                    Card {item.id}
                </Animated.Text>
                </View>


            {isTop && (
            <View style={styles.iconOverlayContainer}>
                <Animated.View style={[styles.iconWrapper, loveIconStyle]}>
                <MaterialCommunityIcons name="heart" size={34} color="#FF0000" />
                </Animated.View>

                <Animated.View style={[styles.iconWrapper, xIconStyle]}>
                <MaterialCommunityIcons name="close" size={34} color="#F87171" />
                </Animated.View>
            </View>
            )}
        </Animated.View>
        </GestureDetector>
    );
    };

    /* ================= MAIN APP ================= */
    export default function SwipeableCard() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const i0 = currentIndex % DATA.length;
    const i1 = (currentIndex + 1) % DATA.length;
    const i2 = (currentIndex + 2) % DATA.length;

    const handleSwipe = useCallback((_dir: SwipeDirection) => {
        setCurrentIndex((prev) => prev + 1);
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.centerContainer}>
            <Card
                key={`c3-${DATA[i2].id}`}
                item={DATA[i2]}
                stackIndex={2}
                onSwipe={handleSwipe}
            />
            <Card
                key={`c2-${DATA[i1].id}`}
                item={DATA[i1]}
                stackIndex={1}
                onSwipe={handleSwipe}
            />
            <Card
                key={`c1-${DATA[i0].id}`}
                item={DATA[i0]}
                stackIndex={0}
                onSwipe={handleSwipe}
            />
            </View>
        </SafeAreaView>
        </GestureHandlerRootView>
    );
    }

    /* ================= STYLES ================= */
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        position: 'absolute',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 32,
        backgroundColor: '#1E293B',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    iconOverlayContainer: {
        position: 'absolute',
        top: 25,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        zIndex: 1000,
    },
    iconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
        textOverlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 18,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
        cardText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    });
