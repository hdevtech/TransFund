// menuItems.js

const originalMenuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/admin/dashboard',
          roles: ['admin'] // admin can access
        },
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/contributor/dashboard',
          roles: ['contributor'] //contributor can access
        }
      ]
    },
    {
      id: 'activities',
      title: 'Activities',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'add-contributor-by-admin',
          title: 'Add Contributor',
          type: 'item',
          icon: 'feather icon-home',
          url: '/admin/AddContributor',
          roles: ['admin'], // Only admin can access
        },
        {
          id: 'view-contributor-by-admin',
          title: 'View Contributors',
          type: 'item',
          icon: 'feather icon-home',
          url: '/admin/ViewContributors',
          roles: ['admin'], // Only admin can access
        },
        {
          id: 'add-fundraising-goals',
          title: 'Add Fundraising Goals',
          type: 'item',
          icon: 'feather icon-home',
          url: '/admin/add-fundraising-goals',
          roles: ['admin'], // Only admin can access
        },
        {
          id: 'view-fundraising-goals',
          title: 'View Fundraising Goals',
          type: 'item',
          icon: 'feather icon-home',
          url: '/admin/view-fundraising-goals',
          roles: ['admin'], // Only admin can access
        },

        //contributor activities
        
        {
          id: 'view-fundraising-goals',
          title: 'View Fundraising Goals',
          type: 'item',
          icon: 'feather icon-home',
          url: '/contributor/view-fundraising-goals',
          roles: ['contributor'], // Only admin can access
        },
      ]
    },
  ]
};

// Function to filter menu items based on user role
const filterMenuItemsByRole = (userRole) => {
  return {
    ...originalMenuItems,
    items: originalMenuItems.items.map(group => ({
      ...group,
      children: group.children.filter(item => !item.roles || item.roles.includes(userRole))
    })).filter(group => group.children.length > 0) // Remove empty groups
  };
};

// Get user role from local storage
const user = JSON.parse(localStorage.getItem('user'));
const userRole = user ? user.role : null;

// Overwrite menuItems with the filtered result
const menuItems = filterMenuItemsByRole(userRole);

// Exporting as menuItems
export default menuItems;
