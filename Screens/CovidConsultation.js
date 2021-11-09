import React, {useState} from 'react'
import {View, Button, Text, StyleSheet, Alert, ActivityIndicator} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'


const CovidConsultation = () => {

    const [Step, setStep] = useState(1)
    const [SymptomBool,setSymptomBool] = useState([
        {state: null, name:"Fever", id: 1},
        {state: null, name:"Cough", id: 2},
        {state: null, name:"Tiredness or Lethargy", id: 3},
        {state: null, name:"Loss of Taste or Smell", id: 4},
        {state: null, name:"Sore Throat", id: 5},
        {state: null, name:"Headaches or Migraine", id: 6},
        {state: null, name:"Aches and Pains", id: 7},
        {state: null, name:"Diarrhoea", id: 8},
        {state: null, name:"Skin Rash or Discoloration of fingers and toes", id: 9},
        {state: null, name:"Eye Redness or Irritation", id: 10},
        {state: null, name:"Difficulty Breather or Shortness of Breath", id: 11},
        {state: null, name:"Loss of Speech or Mobility, or Confusion", id: 12},
        {state: null, name:"Chest Pains", id: 13},
    ])

    const updateArrState = async (id, state) =>{
        let extractItemWithId = SymptomBool.filter((item)=>{
            if (item.id !== id) return item
        })
        let newItem = SymptomBool[id-1]
        newItem.state = state;
        let newArr = [...extractItemWithId, newItem]
        const finalArr = newArr.sort((a, b) => a.id<b.id? -1 : a.id>b.id? 1 : 0) 
        setSymptomBool(finalArr)
    }

    const [Fetching, setFetching] = useState(false)
    const fetchApi = async () => {
        setFetching(true)
        var i = 0
        for (i = 0; i < SymptomBool.length; i++){
            if (SymptomBool[i].state == null) {
                Alert.alert('Required Field(s)', `Question no.${i+1} was not answered`)
                setStep(i+1)
                setFetching(false)
                return
            }
        }
        // fetch api
        const formBody = new FormData()
        const symptoms = SymptomBool.map((item)=>{return item.name})
        const symptomsVal = SymptomBool.map((item)=>{return item.state})
        console.log({symptoms}, {symptomsVal})
        formBody.append('symptoms', JSON.stringify(await symptoms))
        formBody.append('symptomsVal', JSON.stringify(await symptomsVal))
        try {
            fetch('https://consultation19-server.herokuapp.com/covid19', {
                method: 'POST',
                body: formBody
            }).then((res,err)=>{setFetching(false)
                if (err) Alert.alert('Error', err.message)
                return res.json()})
            .then((resJson, err)=>{
                if (err || resJson.status === 'error'){
                    Alert.alert('Error', err.message || resJson.status.log,)
                } else {
                    Alert.alert(resJson.diagnosis.title, resJson.diagnosis.message,)
                }
                setFetching(false)
            })
        } catch (error) {
            Alert.alert('Error', error.message)
            setFetching(false)
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.headerText}>Did you experience the following symptoms in the last 7 days?</Text>
            </View>
            <View>
                {SymptomBool.map((item)=>{
                    return Step==item.id && <View key={item.id}>
                        <Text style={{color: 'black', fontSize: 18, textAlign: 'center', padding: 30}} >{item.name}</Text>
                        <Button
                            title={`Yes`}
                            color={item.state == true && 'green'}
                            onPress={()=>{updateArrState(item.id, true)}}
                        />
                        <Button
                            title={`No`}
                            color={item.state == false && 'red'}
                            onPress={()=>{updateArrState(item.id, false)}}
                        />
                    </View>
                })}
                {Step == 14 && <View style={{paddingTop: 20, alignItems: 'center', justifyContent: 'center'}}>
                    <Button
                        title={'Diagnose'}
                        color='gray'
                        onPress={()=>fetchApi()}
                        disabled={Fetching}
                    />
                    {Fetching==true && <ActivityIndicator />}
                </View> }
            </View>
            <View style={styles.footer}>
                <Text style={{padding: 30, color: 'black', fontSize: 18}}>Question number {Step}</Text>
                <View style={{flexDirection: 'row'}} >
                    <Button
                    title="Previous Item"
                    color="#283331"
                    onPress={()=>{Step>1&& setStep(Step-1)}}
                    disabled={Step==1}
                />
                <Button
                    title="Next Item"
                    color="#0DEBC9"
                    onPress={()=>{Step<14&& setStep(Step+1)}}
                    disabled={Step==14}
                />
                </View>
            </View>
            
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 30}}>
                {SymptomBool.map((item)=>{
                return <View key={item.id} style={{transform: Step==item.id?[{scale: 1.3}]:[]}}>
                    <FontAwesomeIcon icon={ faCheckCircle } color={item.state==true? 'green': item.state==false ? 'red': 'black'} />
                </View>
            })}
            </View>
        </View>
    )
}

    const styles = StyleSheet.create({
        container:{
            padding: '2.5%',
        },
        headerText:{
            fontSize: 20,
            color: 'black',
            textAlign: 'center'
        },
        footer:{
            alignItems: 'center',
            justifyContent: 'center'
        },
    })



export default CovidConsultation