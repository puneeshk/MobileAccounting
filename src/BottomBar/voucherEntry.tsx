import React, { useCallback,  useState } from 'react';
import COLORS from '../../constants/color';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BACK, UPARROW, DOWNARROW } from '../utils/imagePath';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@react-native-vector-icons/feather';
import axiosInstance from '../config/axios';
import { useFocusEffect } from '@react-navigation/native';
import { voucherApiUrls } from '../services/api';

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
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVouchers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(voucherApiUrls.GET_ALL ,{
        voucherType: "",
        fromDate: null,
        toDate: null,
        createdBy: 0
      });
      
      if (response.data.success) {
        setVouchers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      Alert.alert('Error', 'Failed to load vouchers');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  useFocusEffect(
    useCallback(() => {
      fetchVouchers();
    }, [])
  );

  const filteredVouchers = vouchers.filter(voucher =>
    voucher.drAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.crAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.narration.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
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

      <View style={styles.searchbar}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Feather name="search" color="#ec7e1d" size={24} style={styles.searchIcon} />
      </View>

      <ScrollView style={styles.scrollView}>
        {filteredVouchers.map((voucher, index) => (
          <TouchableOpacity 
            key={voucher.voucherId} 
            // onPress={() => navigation.navigate('VoucherDetail', { voucherId: voucher.voucherId })}
          >
            <View style={styles.whiteCard}>
              <View style={styles.rowColumn}>
                <Text style={styles.label}>Voucher ID</Text>
                <Text style={styles.valueText}>{voucher.voucherId}</Text>
              </View>
              
              <View style={styles.rowColumn}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.valueText}>{formatDate(voucher.date)}</Text>
              </View>
              
              <View style={styles.rowColumn}>
                <Text style={styles.label}>Type</Text>
                <Text style={styles.valueText}>{voucher.vouType}</Text>
              </View>
              
              <View style={styles.rowColumn}>
                <Text style={styles.label}>Debit Account</Text>
                <Text style={styles.valueText}>{voucher.drAccount}</Text>
              </View>
              
              <View style={styles.rowColumn}>
                <Text style={styles.label}>Credit Account</Text>
                <Text style={styles.valueText}>{voucher.crAccount}</Text>
              </View>
              
              <View style={styles.rowColumn}>
                <Text style={styles.label}>Amount</Text>
                <Text style={styles.valueText}>
                  <Image 
                    source={voucher.drCr === 'Dr' ? UPARROW : DOWNARROW} 
                    style={styles.upArrow} 
                  />
                  {formatCurrency(voucher.amount)}
                </Text>
              </View>
              
              <View style={styles.rowColumn}>
                <Text style={styles.label}>Narration</Text>
                <Text style={styles.valueText}>
                  {voucher.narration || '-'}
                </Text>
              </View>
              
              <View style={styles.rowColumn}>
                <Text style={styles.label}>Status</Text>
                <Text style={[
                  styles.valueText,
                  { color: voucher.confirmed ? COLORS.success : COLORS.warning }
                ]}>
                  {voucher.confirmed ? 'Confirmed' : 'Pending'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
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
  searchbar: {
    backgroundColor: '#ececec',
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
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
    backgroundColor: '#ececec',
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: COLORS.lightGrey,
    fontSize: 13,
    fontWeight: '400',
    flex: 1,
  },
  valueText: {
    color: COLORS.black,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
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
  }
});