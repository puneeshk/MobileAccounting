import React, { useState, useEffect } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BACK } from '../utils/imagePath';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import COLORS from '../../constants/color';
import { AccountAPIUrls, voucherApiUrls } from '../services/api';
import axiosInstance from '../config/axios';

interface Account {
    accountId: number;
    name: string;
    shortCode: string;
    drcr: 'dr' | 'cr';
}

interface VoucherData {
    voucherDate: string;
    voucherType: string;
    drAccountId: number;
    crAccountId: number;
    amount: number;
    narration: string;
    createdBy: number;
}

export default function AddVoucher({ navigation }: any) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [debitAccounts, setDebitAccounts] = useState<Account[]>([]);
    const [creditAccounts, setCreditAccounts] = useState<Account[]>([]);
    const [formData, setFormData] = useState<VoucherData>({
        voucherDate: new Date().toISOString(),
        voucherType: '',
        drAccountId: 0,
        crAccountId: 0,
        amount: 0,
        narration: '',
        createdBy: 1
    });
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(AccountAPIUrls.GET_ALL);
            if (response.data.success) {
                const allAccounts = response.data.data;
                setAccounts(allAccounts);
                setDebitAccounts(allAccounts.filter((acc: Account) => acc.drcr === 'dr'));
                setCreditAccounts(allAccounts.filter((acc: Account) => acc.drcr === 'cr'));
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
            Alert.alert('Error', 'Failed to load accounts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleDateConfirm = (selectedDate: Date) => {
        setFormData({ ...formData, voucherDate: selectedDate.toISOString() });
        hideDatePicker();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const handleInputChange = (field: keyof VoucherData, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        if (!formData.voucherType) {
            Alert.alert('Error', 'Please select voucher type');
            return;
        }
        if (!formData.drAccountId) {
            Alert.alert('Error', 'Please select debit account');
            return;
        }
        if (!formData.crAccountId) {
            Alert.alert('Error', 'Please select credit account');
            return;
        }
        if (formData.amount <= 0) {
            Alert.alert('Error', 'Please enter valid amount');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await axiosInstance.post(voucherApiUrls.CREATE, formData);
            if (response.data) {
                Alert.alert('Success', 'Voucher created successfully');
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error creating voucher:', error);
            Alert.alert('Error', 'Failed to create voucher');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <LinearGradient
                colors={['#ec7d20', '#be2b2c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ paddingTop: 20, paddingBottom: 20 }}
            >
                <Pressable onPress={() => navigation.goBack()} style={styles.back}>
                    <Image source={BACK} style={styles.backIcon} />
                </Pressable>
                <Text style={styles.heading}>Add Voucher</Text>
            </LinearGradient>

            <ScrollView style={styles.scrollView}>
                <View style={styles.whiteCard}>
                    {/* Voucher Type */}
                    <View style={styles.gap}>
                        <Text style={styles.label}>Voucher Type*</Text>
                        <View style={pickerSelectStyles.inputAndroid}>
                            <Picker
                                selectedValue={formData.voucherType}
                                onValueChange={(value) => handleInputChange('voucherType', value)}
                                style={{ color: COLORS.black }}
                            >
                                <Picker.Item label="Select voucher type..." value="" />
                                <Picker.Item label="Journal Voucher (JV)" value="Journal" />
                                <Picker.Item label="Cash Voucher (CV)" value="Cash" />
                                <Picker.Item label="Bank Voucher (BV)" value="Bank" />
                            </Picker>
                        </View>
                    </View>

                    {/* Date */}
                    <View style={styles.gap}>
                        <Text style={styles.label}>Date*</Text>
                        <TouchableOpacity onPress={showDatePicker} activeOpacity={0.8}>
                            <TextInput
                                style={styles.input}
                                placeholder="DD/MM/YYYY"
                                value={formatDate(formData.voucherDate)}
                                editable={false}
                                pointerEvents="none"
                            />
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleDateConfirm}
                            onCancel={hideDatePicker}
                            maximumDate={new Date()}
                        />
                    </View>

                    {/* Debit Account */}
                    <View style={styles.gap}>
                        <Text style={styles.label}>Debit Account*</Text>
                        <View style={pickerSelectStyles.inputAndroid}>
                            <Picker
                                selectedValue={formData.drAccountId}
                                onValueChange={(value) => handleInputChange('drAccountId', value)}
                                style={{ color: COLORS.black }}
                            >
                                <Picker.Item label="Select debit account..." value={0} />
                                {debitAccounts.map((account) => (
                                    <Picker.Item 
                                        key={account.accountId} 
                                        label={`${account.name} (${account.shortCode})`} 
                                        value={account.accountId} 
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Credit Account */}
                    <View style={styles.gap}>
                        <Text style={styles.label}>Credit Account*</Text>
                        <View style={pickerSelectStyles.inputAndroid}>
                            <Picker
                                selectedValue={formData.crAccountId}
                                onValueChange={(value) => handleInputChange('crAccountId', value)}
                                style={{ color: COLORS.black }}
                            >
                                <Picker.Item label="Select credit account..." value={0} />
                                {creditAccounts.map((account) => (
                                    <Picker.Item 
                                        key={account.accountId} 
                                        label={`${account.name} (${account.shortCode})`} 
                                        value={account.accountId} 
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Amount */}
                    <View style={styles.gap}>
                        <Text style={styles.label}>Amount*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Amount"
                            value={formData.amount > 0 ? formData.amount.toString() : ''}
                            onChangeText={(text) => handleInputChange('amount', parseFloat(text) || 0)}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Narration */}
                    <View style={styles.gap}>
                        <Text style={styles.label}>Narration</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                            placeholder="Enter Narration"
                            value={formData.narration}
                            onChangeText={(text) => handleInputChange('narration', text)}
                            multiline
                        />
                    </View>

                    {/* Submit Button */}
                    <LinearGradient
                        colors={['#ec7d20', '#be2b2c']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ borderRadius: 50 }}
                    >
                        <Pressable
                            style={styles.addButton}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Submit</Text>
                            )}
                        </Pressable>
                    </LinearGradient>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
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
        backgroundColor: COLORS.grey,
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
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
        height: 48,
        borderWidth: 1,
        borderColor: '#DFDFDF',
        borderRadius: 4,
        paddingLeft: 8,
        marginBottom: 8,
        justifyContent: 'center',
    },
    inputIOS: {
        height: 48,
        borderWidth: 1,
        borderColor: '#DFDFDF',
        borderRadius: 4,
        paddingLeft: 8,
        marginBottom: 8,
        justifyContent: 'center',
    },
});