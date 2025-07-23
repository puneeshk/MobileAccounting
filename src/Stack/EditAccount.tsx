import { useEffect, useState } from "react";
import COLORS from "../../constants/color";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    Image,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BACK } from "../../utils/imagePath";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, RadioButton } from "react-native-paper";
import axiosInstance from "../config/axios";
import { useRoute } from "@react-navigation/native";

type RouteParams = {
    account: {
        accountId: number;
        shortCode: string;
        name: string;
        openingBalance: number;
    };
};

export default function EditAccount({ navigation }: any) {
    const route = useRoute();
    const { id } = route.params as { id: number };
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState("Credit");
    const [shortCode, setShortCode] = useState("");
    const [name, setName] = useState("");
    const [openingBalance, setOpeningBalance] = useState("");


    const updateAccountHandler = async () => {
        // if (!shortCode || !name || !openingBalance) {
        //     Alert.alert('Error', 'Please fill all fields');
        //     return;
        // }
        // const balance = parseFloat(openingBalance);
        // if (isNaN(balance)) {
        //     Alert.alert('Error', 'Please enter a valid opening balance');
        //     return;
        // }
        // const adjustedBalance = value === 'Debit' ? -Math.abs(balance) : Math.abs(balance);
        // try {
        //     setIsLoading(true);
        //     const res = await axiosInstance.put("/api/AccountMaster", {
        //         shortCode,
        //         name,
        //         openingBalance: adjustedBalance,
        //         createdBy: 1,
        //         createdAt: new Date().toISOString()
        //     });
        //     if (res.data) {
        //         Alert.alert('Success', 'Account added successfully');
        //         navigation.goBack();
        //     }
        // } catch (error) {
        //     console.log("Error in add account", error);
        //     Alert.alert('Error', 'Failed to add account');
        // } finally {
        // }
    };

    const getEditAccount = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/AccountMaster/${id}`);
            const accountData = response.data;
            setShortCode(accountData.shortCode);
            setName(accountData.name);
            setOpeningBalance(Math.abs(accountData.openingBalance).toString());
            setValue(accountData.openingBalance >= 0 ? "Credit" : "Debit");
        } catch (error) {
            console.error("Error fetching accounts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getEditAccount();
    }, []);

    return (
        <>

            <SafeAreaView style={styles.container} edges={["top"]}>
                <LinearGradient
                    colors={["#ec7d20", "#be2b2c"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ paddingTop: 20, paddingBottom: 20 }}
                >
                    <Pressable onPress={() => navigation.goBack()} style={styles.back}>
                        <Image source={BACK} style={styles.backIcon} />
                    </Pressable>
                    <Text style={styles.heading}>Edit Account</Text>
                </LinearGradient>
                {loading ? <ActivityIndicator style={{ paddingTop: 80 }} size="large" color="#ec7d20" /> : <ScrollView style={styles.scrollView}>
                    <View style={styles.whiteCard}>
                        <View style={styles.gap}>
                            <Text style={styles.label}>Short Code</Text>
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Short Code"
                                    value={shortCode}
                                    onChangeText={setShortCode}
                                />
                            </View>
                        </View>
                        <View style={styles.gap}>
                            <Text style={styles.label}>Name</Text>
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="eg. John Doe"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>
                        <View style={styles.gap}>
                            <Text style={styles.label}>Opening Balance</Text>
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="eg. 25,000.00"
                                    value={openingBalance}
                                    onChangeText={setOpeningBalance}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <View style={styles.gap}>
                            <RadioButton.Group onValueChange={setValue} value={value}>
                                <View style={styles.radioGroup}>
                                    <View
                                        style={{ flexDirection: "row", alignItems: "center" }}
                                    >
                                        <RadioButton value="Credit" color="#ec7d20" />
                                        <Text>Credit</Text>
                                    </View>
                                    <View
                                        style={{ flexDirection: "row", alignItems: "center" }}
                                    >
                                        <RadioButton value="Debit" color="#ec7d20" />
                                        <Text>Debit</Text>
                                    </View>
                                </View>
                            </RadioButton.Group>
                        </View>
                        <LinearGradient
                            colors={["#ec7d20", "#be2b2c"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={{ borderRadius: 50 }}
                        >
                            <Pressable
                                style={styles.addButton}
                                onPress={updateAccountHandler}
                            // disabled={isLoading}
                            >
                                <View>
                                    <Text style={styles.buttonText}>
                                        {/* {isLoading ? 'Processing...' : 'Submit'} */}submit
                                    </Text>
                                </View>
                            </Pressable>
                        </LinearGradient>
                    </View>
                </ScrollView>}

            </SafeAreaView>

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        paddingTop: 0,
    },
    back: {
        width: 30,
        height: 30,
        position: "absolute",
        top: 20,
        left: 12,
        zIndex: 4,
    },
    backIcon: {
        width: 30,
        height: 30,
    },
    heading: {
        color: COLORS.white,
        fontWeight: "500",
        fontSize: 20,
        textAlign: "center",
    },
    scrollView: {
        backgroundColor: COLORS.lightBlue,
        height: "100%",
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 24,
    },
    whiteCard: {
        backgroundColor: COLORS.white,
        width: "100%",
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 24,
        borderRadius: 4,
        shadowColor: "#000",
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
        fontWeight: "500",
        fontSize: 14,
        lineHeight: 18,
        marginBottom: 8,
        padding: 0,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#DFDFDF",
        borderRadius: 4,
        paddingLeft: 12,
        paddingRight: 12,
    },
    radioGroup: {
        gap: 16,
        flexDirection: "row",
        display: "flex",
    },
    addButton: {
        width: "100%",
        height: 48,
        color: COLORS.white,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "500",
    },
});
