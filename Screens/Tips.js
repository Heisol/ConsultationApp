import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'

const Tips = () => {

    const [cards, setCards] = useState(null)

    const fetchData = () => {
        fetch('https://consultation19-server.herokuapp.com/covid19')
            .then((res) => res.json())
            .then(async (resJson) => {
                let tempArr = await resJson.items.map((data) => {
                    if (data.id == 1) return { data, viewable: true }
                    else return { data, viewable: false }
                })
                setCards(tempArr)
            })
    }

    if (cards === null) fetchData()

    const [step, setStep] = useState(1)
    const displayCurrentStep = (stepToDisplay) => {
        setStep(stepToDisplay)
        let tempArr = cards
        for (let i = 0; i < tempArr.length; i++) tempArr[i].viewable = false
        tempArr[stepToDisplay - 1].viewable = true
        setCards(tempArr)
    }

    return (
        <View style={Styles.container}>
            {cards ?
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} >
                    <TouchableOpacity disabled={step == 1} onPress={() => displayCurrentStep(step - 1)}>
                        <FontAwesomeIcon color='#4E289B' icon={faSortUp} size={30} />
                    </TouchableOpacity>
                    <ScrollView style={Styles.scrollContainer} >
                        {
                            cards.map(({ data, viewable }) => {
                                return (
                                    <FlatListComponentToRender key={data.id} item={data} viewable={viewable} />
                                )
                            })
                        }
                    </ScrollView>
                    <TouchableOpacity disabled={step == cards.length} onPress={() => displayCurrentStep(step + 1)} >
                        <FontAwesomeIcon color='#4E289B' icon={faSortDown} size={30} />
                    </TouchableOpacity>
                </View>
                : <ActivityIndicator size={50} color="gray" style={{ justifyContent: 'center', alignSelf: 'center', height: '100%' }} />
            }
        </View>
    )
}

const FlatListComponentToRender = ({ item, viewable }) => {
    return (
        <View style={viewable ? [Styles.card, Styles.cardShow] : Styles.card} >
            <Text style={Styles.headerText} >{item.title}</Text>
            <Text style={Styles.bodyText} >{item.text}</Text>
        </View >
    )
}

const Styles = StyleSheet.create({
    container: {
        padding: '2.5%',
    },
    scrollContainer: {
        height: '90%'
    },
    card: {
        display: 'none'
    },
    cardShow: {
        borderColor: '#996FEE',
        opacity: 0.75,
        display: 'flex',
        marginVertical: '20%',
        height: 500,
        borderRadius: 25,
        padding: 25,
        color: 'black',
        fontSize: 18,
        borderBottomWidth: 3,
        borderTopWidth: 3,
    },
    headerText: {
        color: 'black',
        fontSize: 25,
        marginBottom: 10
    },
    bodyText: {
        color: 'black',
        fontSize: 18
    },
    fixedHeader: {
    },
    fixedFooter: {

    }
})

export default Tips
