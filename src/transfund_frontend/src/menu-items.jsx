const menuItems = {
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
          url: '/admin/dashboard'
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
          url: '/admin/AddContributor'
        },
        {
          id: 'view-contributor-by-admin',
          title: 'View Contributors',
          type: 'item',
          icon: 'feather icon-home',
          url: '/admin/ViewContributors'
        },
        {
          id: 'add-fundraising-goals',
          title: 'Add Fundraising Goals',
          type: 'item',
          icon: 'feather icon-home',
          url: '/admin/add-fundraising-goals'
        },
        {
          id: 'view-fundraising-goals',
          title: 'View Fundraising Goals',
          type: 'item',
          icon: 'feather icon-home',
          url: '/admin/view-fundraising-goals'
        },

      ]
    },

  ]
};

export default menuItems;
