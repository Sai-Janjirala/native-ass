import React from 'react';
import { StyleSheet, View, Text, Pressable, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export const PremiumCard = ({
  title,
  description,
  iconName,
  onPress,
  style,
  rightElement,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const CardContent = (
    <View style={[
      styles.card, 
      { 
        backgroundColor: colorScheme === 'dark' ? '#1E2123' : '#FFFFFF',
        borderColor: colorScheme === 'dark' ? '#2F3336' : '#EAF0F6',
      },
      style
    ]}>
      <View style={styles.cardHeader}>
        {iconName && (
          <View style={[
            styles.iconWrapper, 
            { backgroundColor: colorScheme === 'dark' ? 'rgba(10, 126, 164, 0.15)' : '#F2FAFD' }
          ]}>
            <Ionicons name={iconName} size={22} color={colors.tint} />
          </View>
        )}
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
          {description && (
            <Text style={[styles.description, { color: colors.icon }]} numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>

        {rightElement ? (
          <View style={styles.rightContainer}>{rightElement}</View>
        ) : onPress ? (
          <Ionicons name="chevron-forward" size={18} color={colors.icon} />
        ) : null}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable 
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressed
        ]}
      >
        {CardContent}
      </Pressable>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  pressable: {
    marginVertical: 6,
    borderRadius: 12,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  rightContainer: {
    marginLeft: 10,
  },
});
