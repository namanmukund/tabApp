import React, {useState, useEffect} from 'react'

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native'
import {withNavigation} from 'react-navigation'

const UserDetail = props => {
  const images = props.route.params.images
  const {name, email, phoneNumber} = props.route.params.res.data.createUser
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}>
      <Text style={styles.userDetailsHeading}>User Details</Text>
      <View style={{marginTop: 15}}>
        <Text style={styles.resultText} testID="nameResult">
          Name: <Text style={styles.resultSubText}>{name}</Text>
        </Text>
        <Text style={styles.resultText} testID="emailResult">
          Email: <Text style={styles.resultSubText}>{email}</Text>
        </Text>
        <Text style={styles.resultText} testID="phoneNumberResult">
          Phone Number: <Text style={styles.resultSubText}>{phoneNumber}</Text>
        </Text>
        <Text style={styles.subHeading}>Images</Text>
        <View style={styles.imagesContainer}>
          {images.map(image => (
            <Image style={styles.image} source={{uri: image}} />
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.goBackTouchable}
        onPress={() => props.navigation.goBack()}>
        <View style={styles.goBackContainer}>
          <Text style={styles.goBackText}>Back to form</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 20,
  },
  image: {
    width: 70,
    height: 70,
    marginLeft: 10,
    marginBottom: 10,
  },
  userDetailsHeading: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1.3,
    marginTop: 20,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.3,
    marginTop: 15,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.3,
    marginTop: 3,
  },
  resultSubText: {fontWeight: '400', fontSize: 16},
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  goBackTouchable: {
    flex: 1,
    height: 40,
    width: '80%',
    alignSelf: 'center',
  },
  goBackContainer: {
    backgroundColor: '#008CBA',
    borderRadius: 80,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackText: {
    color: 'white',
    fontSize: 16,
  },
})

export default withNavigation(UserDetail)
