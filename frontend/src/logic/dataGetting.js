import axios from "axios";
import { ElMessage } from "element-plus";

async function getData(postUrl, requestBody, successCallback) {
  try {
    const res = await axios.post(postUrl, requestBody);
    if (res.data.ok) {
      successCallback(res.data);
    }
  } catch (err) {
    console.error(err);
    ElMessage.error(err);
  }
}

export { getData };
