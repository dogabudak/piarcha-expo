import React, { useState } from 'react';
import { ScrollView, StyleSheet, Pressable, Modal } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface DropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function Dropdown({ 
  label, 
  options, 
  selectedValue, 
  onValueChange, 
  placeholder = 'Select...' 
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      
      <Pressable
        style={styles.selector}
        onPress={() => setIsOpen(true)}
      >
        <ThemedText style={[
          styles.selectorText,
          !selectedValue && styles.placeholderText
        ]}>
          {selectedValue || placeholder}
        </ThemedText>
        <IconSymbol 
          name={isOpen ? "chevron.up" : "chevron.down"} 
          size={16} 
          color="#666" 
        />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.overlay}
          onPress={() => setIsOpen(false)}
        >
          <ThemedView style={styles.dropdown}>
            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={true}
            >
              {options.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.option,
                    selectedValue === option && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(option)}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      selectedValue === option && styles.selectedOptionText
                    ]}
                  >
                    {option}
                  </ThemedText>
                  {selectedValue === option && (
                    <IconSymbol name="checkmark" size={16} color="#007AFF" />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </ThemedView>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  selector: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  selectorText: {
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: 300,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  scrollView: {
    maxHeight: 280,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});