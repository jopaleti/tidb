import mysql from "mysql";

// TiDB connection configuration
const connection = mysql.createConnection({
	host: "gateway01.eu-central-1.prod.aws.tidbcloud.com",
	port: 4000,
	user: "4UPFUtJVYGte9Kc.root",
	password: "JBXfjv3CXBjRa8JO",
	database: "test",
	ssl: {
		minVersion: "TLSv1.2",
		rejectUnauthorized: true,
	},
});

export default connection;
