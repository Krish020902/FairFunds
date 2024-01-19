import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const ContributionApp = () => {
  const [names, setNames] = useState([]);
  const [amount, setAmount] = useState(0);
  const [newName, setNewName] = useState("");
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [averageAmount, setAverageAmount] = useState(0);
  const [owesList, setOwesList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editNameModalVisible, setEditNameModalVisible] = useState(false);

  const handleAddName = (name) => {
    setNames([...names, { name, amount: "0", color: getRandomColor() }]);
    setNewName("");

    if (names.length === 1) {
      setShowAmountInput(true);
    }
  };

  const handleEditName = (index) => {
    setEditingIndex(index);
    setEditNameModalVisible(true);
  };

  const handleEditNameSubmit = (updatedName) => {
    if (updatedName) {
      const updatedNames = [...names];
      updatedNames[editingIndex].name = updatedName;
      setNames(updatedNames);
    }
    setEditingIndex(null);
    setEditNameModalVisible(false);
  };

  const handleDeletePerson = (index) => {
    const updatedNames = [...names];
    updatedNames.splice(index, 1);
    setNames(updatedNames);
  };

  const handleCalculateShare = () => {
    const totalPeople = names.length;

    const contributionsArray = names.map((person) => ({
      name: person.name,
      amount: parseFloat(person.amount),
    }));

    setContributions(contributionsArray);

    const totalAmount = contributionsArray.reduce(
      (acc, person) => acc + person.amount,
      0
    );
    const average = totalAmount / totalPeople;
    setAverageAmount(average.toFixed(2));

    const owes = [];

    contributionsArray.forEach((person) => {
      let amountOwed = person.amount - average;
      if (amountOwed < 0) {
        const creditors = contributionsArray.filter(
          (creditor) => creditor.amount > average
        );
        creditors.forEach((creditor) => {
          const individualOweAmount = Math.min(
            Math.abs(amountOwed),
            creditor.amount - average
          );

          const remainingOweAmount = amountOwed + individualOweAmount;
          amountOwed = remainingOweAmount;

          if (individualOweAmount > 0) {
            owes.push({
              from: person.name,
              to: creditor.name,
              amount: individualOweAmount.toFixed(2),
            });

            creditor.amount -= individualOweAmount;
          }
        });
      }
    });
    setOwesList(owes);
  };

  const handleReset = () => {
    setNames([]);
    setAmount(0);
    setNewName("");
    setShowAmountInput(false);
    setContributions([]);
    setAverageAmount(0);
    setOwesList([]);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Enter Names and Amount beside them
      </Text>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={styles.searchBar}
          placeholder="Enter name"
          value={newName}
          onChangeText={(text) => setNewName(text)}
        />
        <TouchableOpacity
          style={{
            alignSelf: "center",
            alignItems: "center",
            padding: 10,
            borderWidth: 2,
            borderColor: "black",
            borderRadius: 30,
          }}
          onPress={() => handleAddName(newName)}
        >
          <Text style={{ color: "black" }}>ADD </Text>
        </TouchableOpacity>
      </View>
      {names.length > 0 && (
        <>
          <FlatList
            style={styles.list}
            data={names}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View
                style={{
                  ...styles.listItem,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "grey",
                }}
              >
                <View
                  style={{
                    borderRadius: 10,
                    padding: 10,
                    backgroundColor: item.color,
                  }}
                >
                  <Text style={{ color: "white" }}>{item.name}</Text>
                </View>
                <TextInput
                  style={styles.amountInput}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  value={item.amount}
                  onChangeText={(text) => {
                    const updatedNames = names.map((person, i) =>
                      i === index ? { ...person, amount: text } : person
                    );
                    setNames(updatedNames);
                  }}
                />
                <TouchableOpacity
                  onPress={() => handleEditName(index)}
                  style={{
                    padding: 10,
                    marginLeft: 10,
                  }}
                >
                  <FontAwesome name="edit" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeletePerson(index)}
                  style={{
                    padding: 10,
                    marginLeft: 10,
                  }}
                >
                  <FontAwesome name="trash" size={24} color="#800000" />
                </TouchableOpacity>
              </View>
            )}
          />
          <Text
            style={styles.averageText}
          >{`Average Amount: ₹${averageAmount}`}</Text>
          {owesList.length > 0 && (
            <FlatList
              style={styles.owesList}
              data={owesList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.owesItem}>
                  <Text>{`${item.from} owes ${item.to} ₹`}</Text>
                  <Text style={{ color: "green" }}>{item.amount}</Text>
                </View>
              )}
            />
          )}
          <TouchableOpacity
            style={{
              alignSelf: "center",
              alignItems: "center",
              padding: 10,
              width: 150,
              borderWidth: 2,
              borderColor: "blue",
              borderRadius: 30,
              marginBottom: 5,
            }}
            onPress={handleCalculateShare}
          >
            <Text style={{ color: "blue" }}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: "center",
              alignItems: "center",
              padding: 10,
              width: 150,
              borderWidth: 2,
              borderColor: "red",
              borderRadius: 30,
            }}
            onPress={handleReset}
          >
            <Text style={{ color: "red" }}>Reset </Text>
          </TouchableOpacity>
        </>
      )}
      <Modal
        visible={editNameModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditNameModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Edit Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter new name"
              onChangeText={(text) => setNewName(text)}
            />
            <Button
              title="Submit"
              onPress={() => handleEditNameSubmit(newName)}
            />
            <Button
              title="Cancel"
              onPress={() => setEditNameModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    width: 300,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 20,
  },
  amountInput: {
    width: 100,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  list: {
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
  },
  averageText: {
    marginTop: 10,
    fontWeight: "bold",
  },
  owesList: {
    marginTop: 10,
  },
  owesItem: {
    flexDirection: "row",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "grey",
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 250,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default ContributionApp;
