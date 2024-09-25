import React from 'react';
import { Card } from 'react-bootstrap';

import sidebarImages from '../../../../assets/images/sidebar.png';

let itemTarget = '_blank';

const NavCard = () => {
  return (
    <React.Fragment>
      <div className="p-20">
        <Card className="pro-card">
          <Card.Body className="p-2 text-center">
            <img src={sidebarImages} className="img-radius " alt="User-Profile" />
            <h5 className="text-white">TransFund</h5>
            <a
              href="https://hdev.rw"
              target={itemTarget}
              className="btn text-white btn-primary"
            >
              TransFund From TREF
            </a>
          </Card.Body>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default NavCard;
