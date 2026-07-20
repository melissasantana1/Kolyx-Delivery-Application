import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Home() {
  const [progressStep, setProgressStep] = useState(1);
  const steps = ['Pedido Recebido', 'Saiu para Entrega', 'Em Trânsito', 'Entregue'];

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* ---------------- HEADER ---------------- */}
      <View style={styles.header}>
        <Image
          source={require('./img/logo3.png')}
          style={styles.profileImage}
          resizeMode="contain"
        />

        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={28} color="#321393" />
        </TouchableOpacity>

        {/* Botão SEND NOW */}
        <TouchableOpacity
          style={styles.headerLabel}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Sendnow')}
        >
          <Text style={styles.headerLabelText}>→ Send now</Text>
        </TouchableOpacity>
      </View>

      {/* ---------------- SCROLLABLE CONTENT ---------------- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* ---------------- SEARCH BOX ---------------- */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInner}>
            <Ionicons name="search" size={20} color="#813EFF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Track your deliveries"
              placeholderTextColor="#C9A8FF"
            />
          </View>
        </View>

        {/* ---------------- CURRENT DELIVERIES SECTION ---------------- */}
        <View style={styles.section}>
          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.currentDeliveriesTitle}>Current Deliveries</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Section Box */}
          <View style={styles.currentDeliveriesBox}>
            <Text style={styles.deliveryInfo}>London → Italy</Text>

            {/* Timeline */}
            <View style={styles.timeline}>
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: index <= progressStep ? '#813EFF' : '#ccc' },
                    ]}
                  />
                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.line,
                        { backgroundColor: index < progressStep ? '#813EFF' : '#ccc' },
                      ]}
                    />
                  )}
                </React.Fragment>
              ))}
            </View>

            <View style={styles.deliveryDates}>
              <Text style={styles.dateText}>Depart: 04 Nov, 08:00</Text>
              <Text style={styles.dateText}>ETA: 07 Nov, 22:00</Text>
            </View>
          </View>
        </View>

        {/* ---------------- PENDING REQUESTS SECTION ---------------- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.pendingRequestsTitle}>Pending Requests</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pendingRequestsBox}>
            <Text style={styles.placeholderText}>No pending requests</Text>
          </View>
        </View>

        {/* ---------------- RECENT DELIVERIES SECTION ---------------- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.recentDeliveriesTitle}>Recent Deliveries</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentDeliveriesBox}>
            <Text style={styles.placeholderText}>No recent deliveries</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ---------------- CONTAINER ----------------
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  // ---------------- HEADER ----------------
  header: {
    backgroundColor: '#813EFF',
    width: 375,
    height: 160,
    borderRadius: 20,
    alignSelf: 'center',
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  profileImage: {
    marginTop: -50,
    top: 0,
    left: 15,
    width: 120,
    height: 70,
  },
  notificationIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  headerLabel: {
    position: 'absolute',
    bottom: -30,
    left: 65,
    backgroundColor: '#321393',
    width: 246,
    height: 62,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLabelText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  // ---------------- SEARCH BOX ----------------
  searchContainer: {
    marginTop: 20,
    marginBottom: -10,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#813EFF',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#321393',
  },

  // ---------------- SECTION ----------------
  section: {
    marginTop: 50,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAll: {
    fontSize: 14,
    color: '#813EFF',
    fontWeight: '600',
    marginRight: 10
  },

  // ---------------- CURRENT DELIVERIES TITLE ----------------
  currentDeliveriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#121212',
  },
  // ---------------- CURRENT DELIVERIES BOX ----------------
  currentDeliveriesBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#fff',
  },

  deliveryInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  line: {
    flex: 1,
    height: 2,
  },
  deliveryDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#555',
  },

  // ---------------- PENDING REQUESTS TITLE ----------------
  pendingRequestsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#121212',
    marginBottom:10,
    marginTop: -10
  },
  // ---------------- PENDING REQUESTS BOX ----------------
  pendingRequestsBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: -10
  },

  // ---------------- RECENT DELIVERIES TITLE ----------------
  recentDeliveriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#121212',
  },
  // ---------------- RECENT DELIVERIES BOX ----------------
  recentDeliveriesBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 20
  },

  // ---------------- PLACEHOLDER TEXT ----------------
  placeholderText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    paddingVertical: 10,
    
  },
});
