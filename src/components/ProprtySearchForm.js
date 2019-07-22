import React from 'react';

class ProprtySearchForm extends React.Component {

  
  constructor(props) {
    super(props);

   

    this.state = {
      isLoaded: false,
      propertyData:null,
      filteredData:null,
      showDetail:false,
      activeProperty:null,
      activeFilter:"",
     
    }

  }



  handleInputChange = (e) => {
    e.preventDefault();

    this.setState({
      [e.target.name]: e.target.value,
    });
  }

    componentDidMount = () => {
        this.onGetPropertyData();
        this.onGetLoginData();
    }

    onGetLoginData = () => {
        let context = this;
        let urlFetch = "https://gist.githubusercontent.com/Lachlanbsmith/858629f93f628c62c4e29a3bb1d99bff/raw/bc403f2f39fbd3d41e48ff893f24d0545907ece0/login"


        fetch(urlFetch)
            .then(res => res.json())
            .then(
                (result) => {
                    context.setState({
                        userName: result.usernameName
                    });
                    
                },

                (error) => {
                    context.setState({
                        isLoaded: false,
                    });

                }
            )
    }

  onGetPropertyData = () => {
  let context = this;
      let urlFetch = "https://gist.githubusercontent.com/Lachlanbsmith/c5eb3b858ff810febd3dfbd5960d3fd8/raw/64a0ba3ee02d52536157d2dd01dddb1069175a8f/buildings"

  
    fetch(urlFetch)
      .then(res => res.json())
      .then(
        (result) => {
          context.setState({
            isLoaded: true,
            propertyData: result,
            filteredData:result
          });
        
        },

        (error) => {
          context.setState({
            isLoaded: false,
          });

        }
      )

  }

  generateCountryFilters = () => {
      let propertyData = this.state.propertyData;
      let newData = [];
      

      propertyData.forEach((property) => {
        newData.push(property.address);
      });
     
   
      const countries = [];
      const map = new Map();
      for (const item of newData) {
          if (!map.has(item.country)) {
              map.set(item.country, true);    // set any value to Map
              countries.push({
                  id: item.id,
                  name: item.country
              });
          }
      }
      
      return countries.map(function (property, index) {
          return (
              <div key={index}>
                  <div className="filter-name" onClick={this.handleFilterByCountry.bind(this, property.name)}> {property.name} </div>
                 
              </div>
          );
      }, this);
      
    }


  generateCityFilters =() =>{
      let propertyData = this.state.propertyData;
      let newData = [];

      propertyData.forEach((property) => {
          newData.push(property.address);
      });


      const cities = [];
      const map = new Map();
      for (const item of newData) {
          if (!map.has(item.city)) {
              map.set(item.city, true);    // set any value to Map
              cities.push({
                  id: item.id,
                  name: item.city
              });
          }
      }
     // console.log(cities);
  
      return cities.map(function (property, index) {
          return (
              <div key={index}>
                  <div className="filter-name" onClick={this.handleFilterByCity.bind(this, property.name)}> {property.name} </div>

              </div>
          );
      }, this);
      
  }
  
    generatePropertyList = () => {
        let propertyData = this.state.filteredData;
        return propertyData.map(function (property, index) {
            return (
                <PropertyElement key={index} property={property} toggleDetail={this.handleShowDetail}/>
            );
        }, this);
       
    }

 

    handleShowDetail =(id) => {
        let propertyData = this.state.propertyData;
        
        let activeProperty = propertyData.find(function (element) {
            return element.id === id;
        });
      
        this.setState({
            showDetail:true,
            activeProperty: activeProperty
        })
    }

    handleFilterByCity = (city) => {

        const result = this.state.propertyData.filter(data => data.address.city !== city);

        this.setState({
            filteredData:result,
            activeFilter: "city"
        })
    }

    handleFilterByCountry = (country) => {
        const result = this.state.propertyData.filter(data => data.address.country !== country);

        this.setState({
            filteredData: result,
            activeFilter:"country"
        })
    }

    handleClearClick = (clearType) => {
        const result = this.state.propertyData.filter(data => data.address.country !== this.state.activeFilter);

      

        if(clearType === "country"){
            this.setState({
                filteredData: result,
                activeFilter: "city"
            })

        }

        if (clearType === "city") {
            this.setState({
                filteredData: result,
                activeFilter: "country"
            })

        }
    
    }

  render() {

    return (
       <div>
            <div className="nav-bar">
                <span className="user-name">{this.state.userName && this.state.userName}</span>
            </div>
            <div className="main-container">
                <div className="filter-container">
                    <div className="country-filters">
                        <label className="label-filter">Country</label>
                        <span className="clear" onClick={this.handleClearClick.bind(this, "country")}> Clear</span>
                        {this.state.propertyData && this.generateCountryFilters()}
                    </div>
                    <div className="city-filters">
                        <label className="label-filter">City</label>
                        <span className="clear" onClick={this.handleClearClick.bind(this, "city")}> Clear</span>
                        {this.state.propertyData && this.generateCityFilters()}

                    </div>
                </div>
                <div className="property-container">
                  
                    <div className="property-list">
                        <input type="text" placeholder="search property" name="search" className="form-input" />
                        {this.state.propertyData && this.generatePropertyList()}
                    </div>
                </div>
                <div className="detail-container">
                   <PropertyDetail display={this.state.showDetail} activeProperty={this.state.activeProperty}/>
                </div>

            </div>
       </div>

      
    );
  }
}

class PropertyElement extends React.Component {
    constructor(props) {
        super(props);



        this.state = {
        
            showActions: false
        }

    }
    
    handleShowActions = () => {
        this.setState({
            showActions: true
        })
    }

    handleHideActions = () => {
        this.setState({
            showActions: false
        })
    }
    generateProductButtons =() => {

        return this.props.property.availableProducts.map(function (product, index) {
            return (
                <button className="btn" key={index} >{product.replace(/([A-Z])/g, ' $1').trim()}</button>
            );
        }, this);
    }

    render() {
        var imgStyle;
        
            imgStyle = {
                backgroundImage: "url(" + this.props.property.imageUrl + ")"
            };
        
        return (
           <div>
                <div className="city-name">{this.props.property.address.city}, {this.props.property.address.country}</div>
                <div className="street-name">{this.props.property.address.line1}</div>
                <div className="img-container" onMouseEnter={this.handleShowActions}
                    onMouseLeave={this.handleHideActions}>
                 
                    <div style={imgStyle} className="img-bg" >
                        <div className={this.state.showActions ? "button-container" : "hidden"}> 
                            <button className="btn" onClick={this.props.toggleDetail.bind(this, this.props.property.id)}>View on Map</button>
                           {this.props.property && this.generateProductButtons()}
                        </div>
                       
                    </div>
                </div>
           </div>
        );
    }
};

class PropertyDetail extends React.Component {
   

    render() {

        return (
            <div className={this.props.display ? "" : "hidden"}>
              {this.props.activeProperty && 
                    <div className="property-detail">
                     <div className="property-name">{this.props.activeProperty.name}</div>
                    <div className="property-img"><img src={this.props.activeProperty.imageUrl} alt={this.props.activeProperty.name} /></div>
                </div>
         }
            </div>
        );
    }
};

export default ProprtySearchForm;