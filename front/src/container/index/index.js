// document.addEventListener("DOMContentLoaded", () => {
//   if (window.session) {
//     const { user } = window.session;
//     const { token } = window.session;

//     if (user.isConfirm) {
//       window.location.assign(`/balance?token=${token}`);
//     } else {
//       window.location.assign("/signup-confirm");
//     }
//   } else {
//     location.assign("/welcome-page");
//   }
// });

import { useEffect } from "react";

const IndexPage = () => {
  useEffect(() => {
    const initializePage = () => {
      if (window.session) {
        const { user, token } = window.session;

        if (user && user.isConfirm) {
          window.location.assign(`/balance?token=${token}`);
        } else {
          window.location.assign("/signup-confirm");
        }
      } else {
        window.location.assign("/welcome-page");
      }
    };

    initializePage();
  }, []);
  return null;
};

export default IndexPage;
