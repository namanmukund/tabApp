import React, {useState, useRef} from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Image,
  Keyboard,
} from 'react-native'
import {TextInputMask} from 'react-native-masked-text'
import {RNCamera} from 'react-native-camera'
import {Formik} from 'formik'
import * as yup from 'yup'
import {gql} from 'apollo-boost'
import {useMutation} from '@apollo/react-hooks'
import {ReactNativeFile} from 'apollo-upload-client'

const CREATE_USER = gql`
  mutation createUser(
    $name: String
    $email: String
    $phoneNumber: String
    $images: [String]
  ) {
    createUser(
      name: $name
      email: $email
      phoneNumber: $phoneNumber
      images: $images
    ) {
      id
      name
      email
      phoneNumber
      images
    }
  }
`

const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload) {
    uploadFile(file: $file) {
      filename
    }
  }
`

const App = props => {
  const cameraType = 'back'
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const nameRef = useRef()
  const emailRef = useRef()
  const phoneNumberRef = useRef()

  const takePicture = async camera => {
    const options = {quality: 0.5, base64: false}
    const data = await camera.takePictureAsync(options)
    setImages([...images, data.uri])
  }

  const [createUser] = useMutation(CREATE_USER)
  const [uploadFile] = useMutation(UPLOAD_FILE)

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Formik
        initialValues={{name: '', email: '', phoneNumber: ''}}
        isInitialValid={false}
        onSubmit={async (values, {setFieldValue, setTouched}) => {
          const resImages = []
          Keyboard.dismiss()
          nameRef.current.blur()
          emailRef.current.blur()
          setIsLoading(true)
          for (const image of images) {
            const splitImagePath = image.split('/')
            const name = splitImagePath[splitImagePath.length - 1]
            const res = await uploadFile({
              variables: {
                file: new ReactNativeFile({
                  uri: image,
                  type: 'image/jpeg',
                  name,
                }),
              },
            })
            resImages.push(res.data.uploadFile.filename)
          }
          const res = await createUser({
            variables: {
              name: values.name,
              email: values.email,
              phoneNumber: values.phoneNumber,
              images: resImages,
            },
          })
          setIsLoading(false)
          setFieldValue('name', '', false)
          setFieldValue('email', '', false)
          setFieldValue('phoneNumber', '', false)
          props.navigation.navigate('UserDetail', {
            res,
            images,
          })
          setTouched({
            name: false,
            email: false,
            phoneNumber: false,
          })
          setImages([])
        }}
        validationSchema={yup.object().shape({
          name: yup.string().required(),
          email: yup
            .string()
            .email()
            .required(),
          phoneNumber: yup.string().required(),
        })}>
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          isValid,
          handleSubmit,
        }) => (
          <SafeAreaView>
            <ScrollView
              testID="scrollView"
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}>
              <Text style={styles.headingText}>Add new user</Text>
              <>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder="Name"
                  autoCorrect={false}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={() => setFieldTouched('name')}
                  testID={'nameInput'}
                  ref={nameRef}
                />
                <Text style={styles.errorText} testID={'nameError'}>
                  {touched.name ? errors.name : ''}
                </Text>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder="email"
                  autoCompleteType="email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={values.email}
                  testID="emailInput"
                  ref={emailRef}
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                />
                <Text style={styles.errorText} testID={'emailError'}>
                  {touched.email ? errors.email : ''}
                </Text>
                <TextInputMask
                  type={'cel-phone'}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) ',
                  }}
                  style={styles.textInputStyle}
                  placeholder="Phone Number"
                  testID="phoneNumberInput"
                  value={values.phoneNumber}
                  ref={phoneNumberRef}
                  onBlur={() => setFieldTouched('phoneNumber')}
                  onChangeText={handleChange('phoneNumber')}
                />
                <Text style={styles.errorText} testID={'phoneNumberError'}>
                  {touched.phoneNumber ? errors.phoneNumber : ''}
                </Text>
              </>

              <RNCamera
                style={styles.preview}
                cameraType={cameraType}
                flashMode={RNCamera.Constants.FlashMode.on}
                aspect="fit"
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                androidRecordAudioPermissionOptions={{
                  title: 'Permission to use audio recording',
                  message: 'We need your permission to use your audio',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}>
                {({camera, status, recordAudioPermissionStatus}) => {
                  if (status !== 'READY') {
                    return <ActivityIndicator animating />
                  }
                  return (
                    <View style={styles.snapButton}>
                      <TouchableOpacity
                        onPress={() => takePicture(camera)}
                        style={styles.capture}>
                        <Text style={{fontSize: 14}}> SNAP </Text>
                      </TouchableOpacity>
                    </View>
                  )
                }}
              </RNCamera>
            </ScrollView>
            <ScrollView horizontal style={styles.imagesScrollView}>
              {images.map(image => (
                <Image
                  key={image}
                  source={{uri: image}}
                  style={{width: 50, height: 50, marginRight: 10}}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            <View style={styles.overlay} pointerEvents="box-none">
              <View
                style={[
                  styles.submitButtonWrapper,
                  {opacity: isValid ? 1 : 0.4},
                ]}>
                <TouchableOpacity
                  style={styles.submitButtonTouchable}
                  onPress={handleSubmit}
                  testID="submitButton">
                  <View style={styles.submitButtonContainer}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        )}
      </Formik>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator animating size="large" />
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 20,
  },
  headingText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1.3,
    marginTop: 20,
  },
  textInputStyle: {
    borderColor: 'gray',
    borderBottomWidth: 1,
    fontSize: 16,
    paddingBottom: 5,
    marginRight: 15,
    paddingLeft: 5,
  },
  preview: {
    flex: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('screen').width - 40,
    height: (Dimensions.get('screen').width - 40) * 0.4,
    marginTop: (Dimensions.get('screen').width - 40) * 0.6,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    margin: 20,
  },
  errorText: {
    color: 'red',
    height: 20,
  },
  submitButtonContainer: {
    backgroundColor: '#008CBA',
    borderRadius: 80,
    height: '70%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonTouchable: {
    flex: 1,
    height: '70%',
    width: '80%',
  },
  submitButtonWrapper: {
    position: 'absolute',
    width: '100%',
    height: 60,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  imagesScrollView: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  snapButton: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loaderContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default App
