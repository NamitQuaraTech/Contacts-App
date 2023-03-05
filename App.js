import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import * as Contacts from "expo-contacts";

export default function App() {
  const [isloading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [inMemory, setInMemory] = useState([]);
  const loadContacts = async () => {
    const permission = await Contacts.requestPermissionsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });
    if (permission.status !== "granted") {
      return;
    }
    const { data } = await Contacts.getContactsAsync();
    // console.log(data);
    setContacts(data);
    setInMemory(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const searchContacts = (value) => {
    const filteredContacts = inMemory.filter((contact) => {
      let contactLowercase = (
        contact.firstName +
        " " +
        contact.lastName
      ).toLowerCase();
      let searchTermLowercase = value.toLowerCase();
      return contactLowercase.indexOf(searchTermLowercase) > -1;
    });
    setContacts(filteredContacts);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: "#2f363c" }} />
      <TextInput
        placeholder="Search"
        placeholderTextColor="#dddddd"
        style={{
          height: 70,
          fontSize: 20,
          backgroundColor: "#2f363c",
          paddingTop: 20,
          paddingLeft: 10,
          color: "#ffffff",
          borderBottomWidth: 1,
          borderBottomColor: "#949494",
        }}
        onChangeText={(value) => searchContacts(value)}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: "#2f363c",
        }}
      >
        {isloading ? (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size={"large"} color={"#baf555"} />
          </View>
        ) : null}
        <ScrollView>
          <View>
            {contacts.map((contact) => (
              <View style={{ minHeight: 70, padding: 5 }} key={contact.id}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      color: "#bada55",
                      fontWeight: "bold",
                      fontSize: 26,
                    }}
                  >
                    {contact.firstName}
                  </Text>
                  {contact.lastName ? (
                    <Text
                      style={{
                        color: "#bada55",
                        fontWeight: "bold",
                        fontSize: 26,
                      }}
                    >
                      {contact.lastName}
                    </Text>
                  ) : (
                    <View></View>
                  )}
                </View>
                <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
                  {contact.phoneNumbers &&
                    contact.phoneNumbers[0] &&
                    contact.phoneNumbers[0].number}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
