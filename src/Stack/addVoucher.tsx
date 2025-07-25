import * as React from 'react'
import COLORS from '../../constants/color'
import { Pressable, StyleSheet, Text, TextInput, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import { BACK } from '../utils/imagePath'
import { LinearGradient } from 'expo-linear-gradient'
import RNPickerSelect from 'react-native-picker-select'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

export default function AddVoucher({ navigation }: any) {
    const [selectedValue, setSelectedValue] = React.useState('')
    const [date, setDate] = React.useState<Date | null>(null)
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false)

    const showDatePicker = () => setDatePickerVisibility(true)
    const hideDatePicker = () => setDatePickerVisibility(false)

    const handleConfirm = (selectedDate: Date) => {
        setDate(selectedDate);
        hideDatePicker();
    }

    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return date.toLocaleDateString('en-GB'); // Change format if needed
    }

    return (
        <>
            {<SafeAreaView style={styles.container} edges={['top']}>
                <LinearGradient
                    colors={['#ec7d20', '#be2b2c']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ paddingTop: 20, paddingBottom: 20 }}
                >
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={styles.back}
                    >
                        <Image source={BACK} style={styles.backIcon} />
                    </Pressable>
                    <Text style={styles.heading}>Add Voucher</Text>
                </LinearGradient>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.whiteCard}>
                        <View style={styles.gap}>
                            <Text style={styles.label}>Voucher Type</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setSelectedValue(value)}
                                placeholder={{ label: 'Select an option...', value: null }}
                                items={[
                                    { label: 'JV', value: 'Journal' },
                                    { label: 'CV', value: 'Cash' },
                                    { label: 'BV', value: 'Bank' },
                                ]} 
                                style={{
                                    inputIOS: styles.input,
                                    inputAndroid: styles.input,
                                }}
                                />
                        </View>
                        <View style={styles.gap}>
                            <Text style={styles.label}>Date</Text>
                            <TouchableOpacity onPress={showDatePicker} activeOpacity={0.8}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="DD/MM/YYYY"
                                    value={formatDate(date)}
                                    editable={false}
                                    pointerEvents="none" // Prevent cursor on press
                                />
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                maximumDate={new Date()} // optional: prevent future dates
                            />
                        </View>
                        <View style={styles.gap}>
                            <Text style={styles.label}>Credit Account</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setSelectedValue(value)}
                                placeholder={{ label: 'Select an option...', value: null }}
                                items={[
                                    { label: 'JV', value: 'Journal' },
                                    { label: 'CV', value: 'Cash' },
                                    { label: 'BV', value: 'Bank' },
                                ]} 
                                style={{
                                    inputIOS: styles.input,
                                    inputAndroid: styles.input,
                                }}
                            />
                        </View>
                        <View style={styles.gap}>
                            <Text style={styles.label}>Debit Account</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setSelectedValue(value)}
                                placeholder={{ label: 'Select an option...', value: null }}
                                items={[
                                    { label: 'JV', value: 'Journal' },
                                    { label: 'CV', value: 'Cash' },
                                    { label: 'BV', value: 'Bank' },
                                ]} 
                                style={{
                                    inputIOS: styles.input,
                                    inputAndroid: styles.input,
                                }}
                                />
                        </View>
                        <View style={styles.gap}>
                             <Text style={styles.label}>Amount</Text>
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Amount"
                                />
                            </View>
                        </View>
                        <View style={styles.gap}>
                            <Text style={styles.label}>Narration</Text>
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Narration"
                                />
                            </View>
                        </View>
                        <LinearGradient
                            colors={['#ec7d20', '#be2b2c']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={{ borderRadius: 50 }}
                        >
                            <Pressable
                                style={styles.addButton}
                            >
                                <View>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </View>
                            </Pressable>
                        </LinearGradient>                            
                    </View>
                </ScrollView>
            </SafeAreaView>}        
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.darkBlue,
        paddingTop: 0
    },
    back: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: 20,
        left: 12,
        zIndex: 4
    },
    backIcon: {
        width: 30,
        height: 30
    },
    heading: {
        color: COLORS.white,
        fontWeight: '500',
        fontSize: 20,
        textAlign: 'center'
    },
    scrollView: {
        backgroundColor: COLORS.lightBlue,
        height: '100%',    
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 24,
    },
    whiteCard: {
        backgroundColor: COLORS.white,
        width: '100%',    
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 24,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    gap: {
        marginBottom: 16,
    },
    label: {
        color: COLORS.black,
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 18,
        marginBottom: 8,
        padding: 0,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#DFDFDF',
        borderRadius: 4,
        paddingLeft: 12,
        paddingRight: 12,
    },
    radioGroup: {
        gap: 16,
        flexDirection: 'row',
        display: 'flex'
    },
    addButton: {
        width: '100%',
        height: 48,
        color: COLORS.white,        
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500'
    }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
});