
/*
 Lesson 16: Supabase login
 Mukono MCH Academic Dashboard
*/

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    loginMessage.textContent = "Signing in...";

    try {
        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {
            loginMessage.textContent =
                "Login failed: " + error.message;
            return;
        }

        const { data: roleData, error: roleError } =
            await supabaseClient
                .from("user_roles")
                .select("role")
                .eq("user_id", data.user.id)
                .single();

        if (roleError || !roleData) {
            loginMessage.textContent =
                "Signed in, but no dashboard role was found.";
            return;
        }

        loginMessage.textContent =
            "Login successful! Your role is: " + roleData.role;
            const dashboard = document.getElementById("dashboard-content");



           // Allow authorised administrators and viewers
const allowedRoles = ["admin", "viewer"];

if (!allowedRoles.includes(roleData.role)) {
    dashboard.hidden = true;
    loginMessage.textContent =
        "Access denied: Your account does not have an authorised role.";

    await supabaseClient.auth.signOut();
    return;
}

// Show dashboard after successful login
     dashboard.hidden = false;
     logoutButton.hidden = false;
     loginForm.hidden = true;

      console.log("User authenticated successfully.");


    } catch (error) {
        loginMessage.textContent =
            "An unexpected login error occurred.";
        console.error(error);
    }
});
// LESSON 16: SIGN OUT

const logoutButton = document.getElementById("logout-button");
const dashboardContent = document.getElementById("dashboard-content");

logoutButton.addEventListener("click", async function () {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        loginMessage.textContent = "Sign out failed: " + error.message;
        return;
    }

    dashboardContent.hidden = true;
    logoutButton.hidden = true;
    loginForm.hidden = false;

    document.getElementById("login-password").value = "";

    loginMessage.textContent = "You have signed out successfully.";
});
// LESSON 17: RESTORE LOGIN SESSION AFTER REFRESH

async function restoreLoginSession() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        return;
    }

    const { data: roleData, error: roleError } =
        await supabaseClient
            .from("user_roles")
            .select("role")
            .eq("user_id", data.user.id)
            .single();

         if (
        roleError ||
        !roleData ||
         !["admin", "viewer"].includes(roleData.role)
) {
        return;
    }

    dashboardContent.hidden = false;
    logoutButton.hidden = false;
    loginForm.hidden = true;

    loginMessage.textContent =
        "Welcome back! Your role is: " + roleData.role;
}

restoreLoginSession();