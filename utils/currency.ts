export const convertToIndianCurrency = (num: number): string => {
    if (!num) return "Zero Rupees Only";
    
    const a = ['','One ','Two ','Three ','Four ','Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
    
    const inWords = (n: any): string => {
        if ((n = n.toString()).length > 9) return 'Overflow';
        n = ('000000000' + n).substr(-9);
        const m = n.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!m) return '';
        
        let str = '';
        str += m[1] != 0 ? (a[Number(m[1])] || b[m[1][0]] + ' ' + a[m[1][1]]) + 'Crore ' : '';
        str += m[2] != 0 ? (a[Number(m[2])] || b[m[2][0]] + ' ' + a[m[2][1]]) + 'Lakh ' : '';
        str += m[3] != 0 ? (a[Number(m[3])] || b[m[3][0]] + ' ' + a[m[3][1]]) + 'Thousand ' : '';
        str += m[4] != 0 ? (a[Number(m[4])] || b[m[4][0]] + ' ' + a[m[4][1]]) + 'Hundred ' : '';
        str += m[5] != 0 ? ((str != '') ? 'and ' : '') + (a[Number(m[5])] || b[m[5][0]] + ' ' + a[m[5][1]]) : '';
        return str;
    };
    
    return inWords(num) + "Rupees Only";
};

export const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-IN');
};

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
};

export const vibrate = (pattern: number | number[] = 5) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};