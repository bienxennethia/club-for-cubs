export const modals = [
  {
    id: "profile",
    path: "/signup",
    class: "modal--signup",
    content: {
      title: "PROFILE",
      fields: [
        {
          label: "Club Name:",
          name: "club_id",
          required: true,
          placeholderText: "Select the name of the Club officiating below",
          type: "select",
          options: []
        },
        {
          label: "First Name:",
          name: "first_name",
          placeholder: "Enter your first name",
          type: "text",
          required: true
        },
        {
          label: "Last Name:",
          name: "last_name",
          placeholder: "Enter your last name",
          type: "text",
          required: true
        },
        {
          label: "Middle Name:",
          name: "middle_name",
          placeholder: "Enter your middle name",
          type: "text",
          required: false
        },
        {
          label: "Email:",
          name: "email",
          placeholder: "Personal email only",
          type: "email",
          required: true
        },
        {
          label: "Grade:",
          name: "year",
          placeholder: "Select your grade year",
          type: "select",
          required: true,
          options: [
            { id: "", name: "Select your grade" },
            { id: "11", name: "Grade 11" },
            { id: "12", name: "Grade 12" }
          ]
        },
        {
          label: "Section:",
          name: "section",
          placeholder: "Enter your section",
          type: "text"
        }
      ]
    }
  },
  {
    id: "signup",
    path: "/signup",
    class: "modal--signup",
    content: {
      title: "SIGN UP",
      fields: [
        {
          label: "Club Name:",
          name: "club_id",
          required: true,
          placeholderText: "Select the name of the Club officiating below",
          type: "select",
          options: []
        },
        {
          label: "First Name:",
          name: "first_name",
          placeholder: "Enter your first name",
          type: "text",
          required: true
        },
        {
          label: "Last Name:",
          name: "last_name",
          placeholder: "Enter your last name",
          type: "text",
          required: true
        },
        {
          label: "Middle Name:",
          name: "middle_name",
          placeholder: "Enter your middle name",
          type: "text",
          required: false
        },
        {
          label: "Email:",
          name: "email",
          placeholder: "Personal email only",
          type: "email",
          required: true
        },
        {
          label: "Password:",
          name: "password",
          placeholder: "Enter your password",
          required: true,
          type: "password",
        },
        {
          label: "Confirm Password:",
          name: "confirm_password",
          placeholder: "Confirm your password",
          required: true,
          type: "password",
        },
        {
          label: "Grade:",
          name: "year",
          placeholder: "Select your grade year",
          type: "select",
          required: true,
          options: [
            { id: "", name: "Select your grade" },
            { id: "11", name: "Grade 11" },
            { id: "12", name: "Grade 12" }
          ]
        },
        {
          label: "Section:",
          name: "section",
          placeholder: "Enter your section",
          type: "text"
        }
      ]
    }
  },
  {
    id: "login",
    path: "/login",
    method: "POST",
    errorMessage: "Failed to login. Please try again.",
    class: "modal--login",
    content: {
      title: "LOG IN",
      description: "I. As a MODERATOR, you have access to posting on the forums for the VISITORs to see",
      subtitle: "as MODERATOR",
      fields: [
        {
          label: "Club Name:",
          name: "club_id",
          placeholderText: "Select the name of the Club officiating below",
          type: "select",
          options: []
        },
        {
          label: "Email:",
          name: "email",
          placeholder: "Personal email only",
          type: "email",
          required: true
        },
        {
          label: "Password:",
          name: "password",
          placeholder: "Enter your password",
          required: true,
          type: "password",
        }
      ]
    }
  },
  {
    id: "addClub",
    path: "/clubs",
    method: "POST",
    errorMessage: "Failed to add club. Please try again.",
    class: "modal--clubs",
    content: {
      title: "ADD CLUB",
      description: "Please fill out the form below to add a new club.",
      subtitle: "",
      fields: [
        {
          name: "type",
          required: true,
          type: "select",
          label: "Club Type:",
          placeholder: "Select type",
          options: [
            { value: "/", label: "Select type" },
          ]
        },
        {
          name: "name",
          required: true,
          type: "text",
          label: "Club Name:",
          placeholder: "Enter Club Name"
        },
        {
          name: "description",
          required: true,
          type: "textarea",
          label: "Description:",
          placeholder: "Enter Club Description"
        },
        {
          name: "mission",
          type: "textarea",
          label: "Mission:",
          placeholder: "Enter Club Mission"
        },
        {
          name: "vision",
          type: "textarea",
          label: "Vision:",
          placeholder: "Enter Club Vision"
        },
        {
          name: "image",
          type: "file",
          placeholder: "Club Image",
          label: "Club Image:",
          required: true
        }
      ]
    }
  },
  {
    id: "editClub",
    path: "/clubs",
    method: "PUT",
    errorMessage: "Failed to edit club. Please try again.",
    class: "modal--club",
    content: {
      title: "EDIT CLUB",
      description: "Please fill out the form below to edit club.",
      subtitle: "",
      fields: [
        {
          name: "type",
          required: true,
          type: "select",
          label: "Club Type:",
          placeholder: "Select type",
          options: [
            { value: "/", label: "Select type" },
          ]
        },
        {
          name: "name",
          required: true,
          type: "text",
          label: "Club Name:",
          placeholder: "Enter Club Name"
        },
        {
          name: "description",
          required: true,
          type: "textarea",
          label: "Description:",
          placeholder: "Enter Club Description"
        },
        {
          name: "mission",
          type: "textarea",
          label: "Mission:",
          placeholder: "Enter Club Mission"
        },
        {
          name: "vision",
          type: "textarea",
          label: "Vision:",
          placeholder: "Enter Club Vision"
        },
        {
          name: "image",
          type: "file",
          placeholder: "Club Image",
          label: "Club Image:"
        }
      ]
    }
  },
  {
    id: "deleteClub",
    class: "modal--club",
    path: "/clubs/delete",
    method: "PUT",
    errorMessage: "Failed to delete club. Please try again.",
    content: {}
  },
  {
    id: "addForum",
    path: "/forums",
    method: "POST",
    errorMessage: "Failed to add club. Please try again.",
    class: "modal--forum",
    content: {
      title: "ADD FORUM",
      description: "Please fill out the form below to add a new forum.",
      subtitle: "",
      type: "add-forum",
      fields: [
        {
          name: "club_id",
          type: "select",
          required: true,
          placeholder: "Select club",
          label: "Select Club:",
          options: []
        },
        {
          name: "forum_name",
          required: true,
          type: "text",
          placeholder: "Enter forum title",
          label: "Title:"
        },
        {
          name: "forum_description",
          required: true,
          type: "textarea",
          placeholder: "Enter forum description",
          label: "Description:"
        },
        {
          name: "forum_image",
          type: "file",
          placeholder: "Forum Image",
          label: "Forum Image:"
        }
      ]
    }
  },
  {
    id: "editForum",
    path: "/forums",
    method: "POST",
    errorMessage: "Failed to edit club. Please try again.",
    class: "modal--forum",
    content: {
      title: "EDIT FORUM",
      description: "Please fill out the form below to edit forum.",
      subtitle: "",
      type: "edit-forum",
      fields: [
        {
          name: "club_id",
          type: "select",
          required: true,
          placeholder: "Select club",
          label: "Select Club:",
          options: []
        },
        {
          name: "forum_name",
          required: true,
          type: "text",
          placeholder: "Enter forum title",
          label: "Title:"
        },
        {
          name: "forum_description",
          required: true,
          type: "textarea",
          placeholder: "Enter forum description",
          label: "Description:"
        },
        {
          name: "forum_image",
          type: "file",
          placeholder: "Forum Image",
          label: "Forum Image:"
        }
      ]
    }
  },
  {
    id: "deleteForum",
    path: "/forums",
    method: "DELETE",
    errorMessage: "Failed to delete club. Please try again.",
    content: {}
  },
  {
    id: "addForumClub",
    path: "/forums",
    class: "modal--forum",
    content: {
      title: "ADD FORUM",
      description: "Please fill out the form below to add a new forum.",
      subtitle: "",
      type: "add-forum",
      fields: [
        {
          name: "forum_name",
          required: true,
          type: "text",
          placeholder: "Title"
        },
        {
          name: "forum_description",
          required: true,
          type: "textarea",
          placeholder: "Description"
        },
        {
          name: "forum_image",
          type: "file",
          placeholder: "Forum Image",
          label: "Forum Image:"
        }
      ]
    }
  },
  {
    id: "changePassword",
    path: "/user",
    method: "POST",
    errorMessage: "Failed to change password. Please try again.",
    class: "modal--forum",
    content: {
      title: "CHANGE PASSWORD",
      description: "Please fill out the form below to change your password.",
      subtitle: "",
      type: "edit-forum",
      fields: [
        {
          name: "password",
          required: true,
          type: "password",
          placeholder: "Enter new password",
          label: "New Password:"
        },
        {
          name: "confirm_password",
          required: true,
          type: "password",
          placeholder: "Confirm new password",
          label: "Confirm Password:"
        }
      ]
    }
  },
];