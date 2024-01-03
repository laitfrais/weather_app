import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const UserModificationPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const navigation = useNavigation();

  const reauthenticateUser = async () => {
    const user = auth.currentUser;

    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      console.error('Erreur lors de la réauthentification :', error.message);
      return false;
    }
  };

  const updateUserPassword = async () => {
    setLoading(true);

    // Vérifier que le nouveau mot de passe et la confirmation correspondent
    if (newPassword !== confirmPassword) {
      alert('Le nouveau mot de passe et la confirmation ne correspondent pas.');
      setLoading(false);
      return;
    }

    // Réauthentifier l'utilisateur
    const isReauthenticated = await reauthenticateUser();

    if (isReauthenticated) {
      // Mettre à jour le mot de passe
      updatePassword(auth.currentUser, newPassword)
        .then(() => {
          alert('Mot de passe mis à jour avec succès.');
        })
        .catch((error) => {
          alert('Erreur lors de la mise à jour du mot de passe : ' + error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      alert('Réauthentification échouée. Assurez-vous que votre ancien mot de passe est correct.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modification du mot de passe</Text>
      <TextInput
        style={styles.input}
        placeholder="Ancien mot de passe"
        secureTextEntry={true}
        value={oldPassword}
        onChangeText={(text) => setOldPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Nouveau mot de passe"
        secureTextEntry={true}
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmer le nouveau mot de passe"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <Button title="Mettre à jour le mot de passe" onPress={updateUserPassword} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default UserModificationPage;
