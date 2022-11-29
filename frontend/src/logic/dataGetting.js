import axios from "axios";
import { ElMessage } from "element-plus";

async function post(
  postUrl,
  requestBody,
  successCallback,
  errorCallback = (error) => {
    console.error(error);
    ElMessage.error(error);
  }
) {
  try {
    const result = await axios.post(postUrl, requestBody);
    if (result.data.ok) {
      successCallback(result.data.result);
    } else if (result.data.error) {
      errorCallback(result.data.error);
    }
  } catch (error) {
    console.error(error);
    ElMessage.error(error);
  }
}

export { post };
