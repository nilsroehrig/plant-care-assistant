import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const app = admin.initializeApp();
await app.firestore()
    .collection("notifications")
    .doc()
    .set({
        owner: "YVWV24l6etY3KULFZECXK1X8zh03",
        message: `${process.argv[2]}`,
        createdAt: Timestamp.fromDate(new Date())
    });


