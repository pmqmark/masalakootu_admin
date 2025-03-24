import React from 'react';
import { Document, Page, Text, View, Rect, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
        color: '#000000'
    },
    section: {
        margin: 10,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        textDecoration: 'underline',

    },
    subheading: {
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
        marginLeft:13,
        // textDecoration: 'underline',
        // textAlign:'left',
        alignSelf:'flex-start'
    },
    paragraph: {
        fontSize: 12,
        lineHeight: 1.5,
        color: '#000000'
    },
    box: {
        width: '550px',
        height: 'auto',
        padding: 10,
        margin: 5,
    },
    toprect: {
        width: '550px',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    topleftrect: {
        width: '250px',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column'
    },
    toprightrect: {
        width: '250px',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column'
    },
    table: {
        width: '100%',
        borderTop:'1px solid #000',
        marginTop: 10,
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom:'1px solid #000',
    },
    tableCell: {
        width: '20%',
        padding: 4,
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 1.5,
        color: '#000000',
        textAlign:'left'
    },
    boldSpan: {
        fontSize: 12,
        lineHeight: 1.5,
        color: '#000000',
        fontWeight: 'extrabold',
        textAlign: 'left'
    },
    boldRightSmSpan: {
        fontSize: 12,
        lineHeight: 1.5,
        color: '#000000',
        fontWeight: 'extrabold',
        textAlign: 'right'
    },
    boldRightLgSpan: {
        fontSize: 14,
        lineHeight: 1.8,
        color: '#000000',
        fontWeight: 'extrabold',
        textAlign: 'right'
    }
});


const PdfReport = ({ data }) => {
    console.log(data)

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                <View style={styles.section}>
                    <Text style={styles.heading}>Invoice</Text>
                    <Text style={styles.subheading}>Sold By: Masalakoottu, Kerala, India </Text>

                    {data
                        ?
                        <Rect style={styles.box}>
                            <Rect style={styles.toprect}>
                                <Rect style={styles.topleftrect}>
                                    <Text style={styles.paragraph}>Order Id : {data?.merchantOrderId}</Text>
                                    <Text style={styles.paragraph}>Order Date : {data?.createdAt?.split('T')[0]?.split('-').reverse().join('-')}</Text>
                                    <Text style={styles.paragraph}>Invoice Date : {new Date().toISOString().split('T')[0]?.split('-').reverse().join('-')}</Text>
                                    <Text style={styles.paragraph}>Delivery : {data?.deliveryType}</Text>
                                    <Text style={styles.paragraph}>Total Items : {data?.items?.length}</Text>
                                </Rect>

                                <Rect style={styles.toprightrect}>
                                    <Text style={styles.boldSpan}>Ship To :</Text>
                                    <Text style={styles.boldSpan}>{data?.shipAddress?.fullName ?? 'N/A'}</Text>
                                    <Text style={styles.paragraph}>{data?.shipAddress?.street ?? 'N/A'}</Text>
                                    <Text style={styles.paragraph}>{data?.shipAddress?.city}, {data?.shipAddress?.state}, {data?.shipAddress?.country}</Text>
                                    <Text style={styles.paragraph}>Pin : {data?.shipAddress?.pinCode ?? 'N/A'}</Text>
                                    <Text style={styles.paragraph}>Phone : {data?.shipAddress?.phoneNumber ?? 'N/A'}</Text>
                                </Rect>
                            </Rect>


                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>Product </Text>
                                    <Text style={styles.tableCell}>Price</Text>
                                    <Text style={styles.tableCell}>Quantity</Text>
                                    <Text style={styles.tableCell}>Total</Text>
                                </View>

                                {
                                    data?.items?.map((row, i) => (
                                        <View key={i} style={styles.tableRow}>
                                            <Text style={styles.tableCell}>{row?.name ?? 'N/A'}</Text>
                                            <Text style={styles.tableCell}>Rs.{row?.price}</Text>
                                            <Text style={styles.tableCell}>{row?.quantity}</Text>
                                            <Text style={styles.tableCell}>Rs.{row.price * row?.quantity}</Text>
                                        </View>
                                    ))
                                }

                            </View>

                            <Text style={styles.boldRightSmSpan}>Subtotal : Rs. {data?.subTotal}</Text>
                            <Text style={styles.boldRightSmSpan}>Tax : Rs. {data?.totalTax}</Text>
                            <Text style={styles.boldRightSmSpan}>Delivery Charge : Rs.{data?.deliveryCharge ?? 0} </Text>
                            <Text style={styles.boldRightSmSpan}>Discount : Rs.{data?.discount ?? 0} </Text>
                            <Text style={styles.boldRightLgSpan}>Grand Total : Rs. {data?.amount ?? 0}</Text>
                            <Text style={styles.boldRightSmSpan}>Masalakoottu Private Limited</Text>
                        </Rect>

                        :
                        <Text style={styles.paragraph}>No Data Available</Text>

                    }

                </View>

            </Page>
        </Document>
    )
}

export default PdfReport