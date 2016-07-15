import React, {Component, PropTypes} from 'react'
import Topic from './Topic'
import {connect} from 'react-redux'
import {subscribe, unsubscribe} from '../reducers/schedule'
import SubscribeButton from '../components/SubscribeButton'
import {
  View,
  Text,
  ScrollView,
  StyleSheet
} from 'react-native'
const AWESOME_COLOR = ['red', 'orange', 'green', 'cyan', 'blue', 'purple']
export default class TopicDetail extends Component {

  static propTypes = {
    topic: PropTypes.object,
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
    isSubscribed: PropTypes.bool
  }

  render () {
    const {topic, isSubscribed} = this.props
    const address = topic.room.name
    const duration = getDuration(topic.start_at, topic.end_at)
    const addressColor = AWESOME_COLOR[topic.id % AWESOME_COLOR.length]
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerFont, {color: addressColor}]}>{address}</Text>
          <Text style={styles.headerFont}> - {duration} min</Text>
        </View>
        <ScrollView style={styles.content}>
          <Topic topic={topic} style={{paddingLeft: 0, paddingRight: 0}}/>
          <Text style={styles.description}>{topic.description}</Text>
        </ScrollView>
        <View style={styles.footer}>
          <SubscribeButton isSubscribed={isSubscribed} onPress={this.toggleAdded} />
        </View>
      </View>
    )
  }

  toggleAdded = () => {
    if (this.props.isSubscribed) {
      this.props.unsubscribe()
    } else {
      this.props.subscribe()
    }
  };
}

function getDuration (start, end) {
  const startHour = start.slice(11, 13)
  const startMin = start.slice(14, 16)
  const endHour = end.slice(11, 13)
  const endMin = end.slice(14, 16)
  return (endHour - startHour) * 60 + (endMin - startMin)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  headerFont: {
    fontSize: 11,
    color: '#555555'
  },
  content: {
    padding: 10
  },
  description: {
    fontSize: 13,
    marginTop: 10,
    lineHeight: 20,
    color: '#555555'
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#eee'
  }
})

const mapStateToProps = (state, props) => ({
  loading: state.schedule.loading,
  error: state.schedule.error,
  isSubscribed: state.schedule.subscription.includes(props.topic.id)
})

const mapDispatchToProps = (dispatch, props) => {
  const id = props.topic.id
  return {
    subscribe: () => dispatch(subscribe(id)),
    unsubscribe: () => dispatch(unsubscribe(id))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(TopicDetail)