import React from 'react';
import _ from 'lodash';
import {bindActionCreators} from 'redux';
import NavigationBar from '../commons/NavigationBar';
import Footer from '../commons/Footer';
import SideBarCaterer from '../commons/SideBarCaterer';
import ContentCaterer from '../commons/ContentCaterer';
import * as savingActions from '../../actions/savingActions';
import * as mealActions from '../../actions/mealActions';
import * as menuActions from '../../actions/menuActions';
import * as orderActions from '../../actions/orderActions';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import toastr from "toastr";

class CatererPage extends React.Component {
  constructor(props, context){
    super(props, context);

    this.state = {
      activeTab: {
        edit_menu: true,
        add_meal: false,
      },

      mealData: {
        name: "",
        price: ""
      },
      mealAddStatus: "",
      meal_ids:[],
    };

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount(){
    // this.testLogin();
    this.props.menuActions.loadMenu();
    this.props.orderActions.getOrdersCaterer();
  }

  testLogin = () => {
    if(!this.props.login[0].isLoggedIn){
      this.context.router.history.push('/');
    }
  };

  onClick = (type, meal_id=false) => (event) => {
    event.preventDefault();
    if(type === 'addMeal'){
      this.props.mealActions.loadMeals();
    }
    else if (type === 'clearOrder'){
          console.log('order id', meal_id);
          this.props.orderActions.clearOrder(meal_id);
        }
    else if (type === "addMealsToMenu") {
      this.props.menuActions.addMealsToMenu({meal_ids: this.state.meal_ids});
    }
    else if (type === 'removeMealFromMenu'){
      this.props.menuActions.removeMealFromMenu({meal_id: meal_id})
        .then(response =>{
          if(response){
            toastr.success('Meal removed from menu');
          }
          else {
            toastr.error('Meal can not be removed')
          }
        });
    }
    else {
      this.setState({
        activeTab: {
          edit_menu: CatererPage.showItem(type, 'showMenu'),
          add_meal: CatererPage.showItem(type, 'showMeal'),
          mealAddStatus: "",
        },
      });
    }

    if(type === 'showMenu'){
      this.props.menuActions.loadMenu();

    }

  };

  static showItem(inString, compareString) {
    return inString === compareString;
  }

  onChange = (type=false) =>(event) => {
    if(!type){
      this.setState({mealAddStatus: ""});
      const field = event.target.name;
      const value = event.target.value;
      let mealData = Object.assign({}, this.state.mealData);
      mealData[field] = value;
      return this.setState({mealData: mealData});
    }

    if(type === 'addMealToMenu'){
      const field = event.target.name;
      const value = event.target.value;

      if(event.target.checked){
        const mealIds = _.concat(this.state.meal_ids, parseInt(value, 10));
        this .setState({meal_ids: mealIds});
      }
      else{
        const mealIds = _.pull(this.state.meal_ids, parseInt(value, 10));
        this .setState({meal_ids: mealIds});

      }
    }
  };

  onSave = (type) => (event) => {
    event.preventDefault();
    this.props.savingActions.saving({saving: true});
    if(type === 'addMeal'){
      console.log('saving meal');
      this.props.mealActions.addMeal(this.state.mealData)
        .then(response => {
          if(response){
            this.setState({mealAddStatus: response});
            toastr.success(response);
          }
        });

        }
      this.setState({
        mealData: {
          name: "",
          price: ""
        }
        });

  };

  render() {
    return (
      <div>
        <NavigationBar/>
        <div className="wrapper background-image">
          <SideBarCaterer
            tabs={this.state.activeTab}
            onClick={this.onClick}
          />
          <ContentCaterer
            tabs={this.state.activeTab}
            mealData={this.state.mealData}
            saving={this.props.saving}
            onChange={this.onChange}
            onSave={this.onSave}
            onClick={this.onClick}
            errors={this.props.errors}
            mealAddStatus={this.state.mealAddStatus}
            meals={this.props.meals}
            menu={this.props.menu}
            meal_ids={this.state.meal_ids}
            orders={this.props.orders}
          />
        </div>
        <Footer/>
      </div>
    );
  };
}

CatererPage.contextTypes = {
  router: PropTypes.object
};

CatererPage.propTypes = {
  savingActions: PropTypes.object.isRequired,
  mealActions: PropTypes.object.isRequired,
  saving: PropTypes.array.isRequired,
  meals: PropTypes.array.isRequired,
  menu: PropTypes.array.isRequired,
  errors: PropTypes.array,
  orders: PropTypes.array.isRequired,
  login: PropTypes.array.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    login: state.login,
    saving: state.saving,
    errors: state.errors,
    meals: state.meals,
    menu: state.menu,
    orders: state.orders,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    savingActions: bindActionCreators(savingActions, dispatch),
    mealActions: bindActionCreators(mealActions, dispatch),
    menuActions: bindActionCreators(menuActions, dispatch),
    orderActions: bindActionCreators(orderActions, dispatch),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(CatererPage);
