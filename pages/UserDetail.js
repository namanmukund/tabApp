import React, {useState, useEffect} from 'react'

import { 
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native'
import { withNavigation } from 'react-navigation'

const UserDetail = props => {
  const images = props.route.params.images
  const { name, email, phoneNumber } = props.route.params.res.data.createUser
  // console.log(JSON.stringify(props, null, 2))
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          letterSpacing: 1.3,
          marginTop: 20,
        }}>
        User Details
      </Text>
      <View style={{ marginTop: 15 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            letterSpacing: 1.3,
            marginTop: 3,
          }}
          testID='nameResult'
          >
          Name: <Text style={{ fontWeight: '400', fontSize: 16 }}>{name}</Text>
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            letterSpacing: 1.3,
            marginTop: 3,
          }}
          testID='emailResult'
          >
          Email: <Text style={{ fontWeight: '400', fontSize: 16 }}>{email}</Text>
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            letterSpacing: 1.3,
            marginTop: 3,
          }}
          testID='phoneNumberResult'
          >
          Phone Number: <Text style={{ fontWeight: '400', fontSize: 16 }}>{phoneNumber}</Text>
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            letterSpacing: 1.3,
            marginTop: 15,
          }}
          >
          Images
        </Text>
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: 20
        }}>
          {images.map(image => (
            <Image style={styles.image} source={{ uri: image }} />
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={{
          flex: 1,
          height: 40,
          width: '80%',
          alignSelf: 'center'
        }}
        onPress={() => props.navigation.goBack()}
        >
        <View
          style={{
            backgroundColor: '#008CBA',
            borderRadius: 80,
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 16
            }}>
            Back to form
          </Text>
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
    marginBottom: 10
  }
})

export default withNavigation(UserDetail)
