import React, { useCallback, useState } from 'react'
import COLORS from '../../constants/color'
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native'
import Modal from 'react-native-modal'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BACK, UPARROW, DOWNARROW } from '../utils/imagePath'
import { LinearGradient } from 'expo-linear-gradient'
import Feather from '@react-native-vector-icons/feather'
import axiosInstance from '../config/axios'
import { useFocusEffect } from '@react-navigation/native'
import { voucherApiUrls } from '../services/api'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

interface Voucher {
  voucherId: number;
  date: string;
  vouType: string;
  drCr: string;
  amount: number;
  drAccount: string;
  crAccount: string;
  confirmed: boolean;
  createdAt: string;
  createdBy: string;
  narration: string;
}

export default function VoucherEntry({ navigation }: any) {
  const [date, setDate] = useState<Date | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  const showDatePicker = () => setDatePickerVisibility(true)
  const hideDatePicker = () => setDatePickerVisibility(false)

  const handleDateConfirm = (selectedDate: Date) => {
    setDate(selectedDate)
    hideDatePicker()
  }

  const fetchVouchers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(voucherApiUrls.GET_ALL, {
        voucherType: "",
        fromDate: null,
        toDate: null,
        createdBy: 0
      })

      if (response.data.success) {
        setVouchers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      Alert.alert('Error', 'Failed to load vouchers');
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }

  const filterFormatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB'); // Change format if needed
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  }

  const handleVoucherPress = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowActionSheet(true);
  }

  const handleEdit = () => {
    if (selectedVoucher) {
      setShowActionSheet(false);
      navigation.navigate('EditVoucher', { voucherId: selectedVoucher.voucherId });
    }
  }

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this voucher?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', onPress: async () => {
            try {
              setIsLoading(true);
              const response = await axiosInstance.post(voucherApiUrls.DELETE, {
                voucherId: selectedVoucher?.voucherId,
                deletedBy: 1
              });

              if (response.data.success) {
                Alert.alert('Success', 'Voucher deleted successfully');
                fetchVouchers();
              }
            } catch (error) {
              console.error('Error deleting voucher:', error);
              Alert.alert('Error', 'Failed to delete voucher');
            } finally {
              setIsLoading(false);
              setShowActionSheet(false);
            }
          }
        },
      ]
    )
  }
  useFocusEffect(
    useCallback(() => {
      fetchVouchers();
    }, [])
  )

  const filteredVouchers = vouchers.filter(voucher =>
    voucher.drAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.crAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.narration.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    )
  }

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top']}>
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
          <Text style={styles.heading}>Voucher Entry</Text>
        </LinearGradient>
      </SafeAreaView>

      <Pressable
        style={styles.add}
        onPress={() => navigation.navigate("AddVoucher")}
      >
        <Feather name="plus" color="#fff" size={20} />
      </Pressable>

      <View style={styles.topbar}>
        <View style={styles.searchbar}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Feather name="search" color="#ec7e1d" size={24} style={styles.searchIcon} />
        </View>
        <Pressable
          onPress={() => setShowFilterModal(true)}
        >
          <Feather name="filter" color="#ec7e1d" size={20} />
        </Pressable>        
      </View>      

      <ScrollView style={styles.scrollView}>
        {filteredVouchers.map((voucher) => (
          <Pressable
            key={voucher.voucherId}
            onPress={() => handleVoucherPress(voucher)}
          >
            <View style={styles.whiteCard}>
              <View style={styles.rowColumn}>
                <Text style={styles.valueText}>{voucher.vouType}</Text>
                <Text style={[styles.valueText, {textAlign: 'center'}]}>{formatDate(voucher.date)}</Text>
                <Text style={[styles.valueText, {textAlign: 'right'}]}>
                  {formatCurrency(voucher.amount)}
                </Text>
              </View>
              <View style={styles.rowColumn}>
                <Text style={[styles.valueText, {color: '#db0500'}]}>
                  <Image
                    source={UPARROW}
                    style={styles.upArrow}
                  /> &nbsp;
                  {voucher.drAccount}
                  </Text>
                <Text style={[styles.valueText, {color: '#04a029', textAlign: 'right'}]}>
                  <Image
                    source={DOWNARROW}
                    style={styles.upArrow}
                  /> &nbsp;
                  {voucher.crAccount}
                </Text>
              </View>

              <View style={[styles.rowColumn, {marginBottom: 0}]}>
                <Text style={styles.valueText}>{voucher.narration || '-'}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        isVisible={showFilterModal}
        onBackdropPress={() => setShowFilterModal(false)}
        style={styles.bottomModal}
      >
        <View style={styles.modalContent}>
          <View style={styles.gap}>
            <Text style={styles.label}>From Date</Text>
              <TouchableOpacity onPress={showDatePicker} activeOpacity={0.8}>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  value={filterFormatDate(date)}
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
          <View style={styles.gap}>
            <Text style={styles.label}>To Date</Text>
              <TouchableOpacity onPress={showDatePicker} activeOpacity={0.8}>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  value={filterFormatDate(date)}
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
          <LinearGradient
            colors={['#ec7d20', '#be2b2c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ borderRadius: 50 }}
          >
            <Pressable
              style={styles.addButton}
            >
              <Text style={styles.buttonText}>Filter</Text>
            </Pressable>
          </LinearGradient>
          <Feather
            name="x"
            color="#000"
            size={24}
            style={styles.close}
            onPress={() => setShowFilterModal(false)}
          />
        </View>
      </Modal>

      <Modal
        isVisible={showActionSheet}
        onBackdropPress={() => setShowActionSheet(false)}
        style={styles.bottomModal}
      >
        <View style={styles.modalContent}>
          <View style={{ 
            marginTop: 24,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex' }}
          >
            <View style={{ width: '48%' }}>
              <Pressable
                style={styles.editButton}
                onPress={handleEdit}
              >
                <Feather name="edit-3" color="#fff" size={20} style={{ marginRight: 6 }} />
                <Text style={styles.buttonText}>Edit</Text>
              </Pressable>
            </View>
            <View style={{ width: '48%' }}>
              <Pressable
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Feather name="trash" color="#fff" size={20} style={{ marginRight: 6 }} />
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
          <Feather
            name="x"
            color="#000"
            size={24}
            style={styles.close}
            onPress={() => setShowActionSheet(false)}
          />
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  back: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 18,
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
  topbar: {
    backgroundColor: '#ececec',
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    gap: 16,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex'
  },
  searchbar: {
    flex: 1
  },
  add: {
    backgroundColor: '#cd4a26',
    width: 48,
    height: 48,
    borderRadius: 40,
    position: 'absolute',
    right: 16,
    bottom: 110,
    zIndex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    backgroundColor: COLORS.white,
    height: 48,
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderRadius: 50,
    paddingLeft: 12,
    paddingRight: 12,
  },
  searchIcon: {
    position: 'absolute',
    bottom: 12,
    right: 28,
    zIndex: 3
  },
  scrollView: {
    backgroundColor: COLORS.grey,
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 24
  },
  whiteCard: {
    backgroundColor: COLORS.white,
    width: '100%',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rowColumn: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    color: COLORS.black,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  upArrow: {
    width: 8,
    height: 8,
    marginRight: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white
  },
  // Action Sheet Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  actionSheet: {
    paddingBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  actionButtonText: {
    fontSize: 16,
    marginLeft: 16,
    color: COLORS.black,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGrey,
    marginVertical: 4,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    paddingTop: 40,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 48,
    color: COLORS.white,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: COLORS.red,
    width: '100%',
    height: 48,
    color: COLORS.white,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  close: {
    position: 'absolute',
    zIndex: 3,
    top: 16,
    right: 16
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
  addButton: {
    width: '100%',
    height: 48,
    color: COLORS.white,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  }
})