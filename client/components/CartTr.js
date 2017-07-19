import React, { Component } from 'react';
import axios from 'axios';
import numberFormat from '../helper/numberFormat';

class CartTr extends Component {

    constructor(){
        super();
        this.state = { 
            product : []
        };
    }

    componentDidMount() {

        axios.get(`/api/admin/products/${this.props.cartId}`, {
        }).then( (res) => {
           this.setState({
                product: res.data.product
            });
        }).catch( (error) => {
            console.log(error); 
        });

    }


    componentWillReceiveProps(nextProps){
        if(nextProps.cartId){
            axios.get(`/api/admin/products/${nextProps.cartId}`, {
            }).then( (res) => {
                this.setState({
                    product: res.data.product
                });
            }).catch( (error) => {
                console.log(error); 
            });
        }
    }


    render() {
        return (
            <tr>
                <td>
                    {this.state.product.thumbnail ? 
                        <img src={`/uploads/${this.state.product.thumbnail}`}  
                        width="50" height="50" alt="" /> : ''
                    }
                    
                </td>
                <td>
                    {this.state.product.product_name}
                </td>
                <td>
                    { 
                        this.state.product.sale_price ?
                        numberFormat(this.state.product.sale_price) :
                        numberFormat(this.state.product.price) 
                    } 원
                </td>
                <td>
                    {this.props.cart.number}
                </td>
                <td>
                    { numberFormat(this.props.cart.amount) } 원
                </td>
                <td>
                    {/* 
                        (event) => 이렇게 처리한 이유는 
                        클릭시 링크를 prevetDefault로 막는데
                        부모함수에서 removeCart를 처리하므로
                        event변수도 넘겨줘야된다.
                    */}
                    <a href="#" className="btn btn-danger" onClick={ (event) => { this.props.removeCart(  this.props.cartId ,event ) } }>
                        장바구니 삭제
                    </a>
                </td>
            </tr>
        );
    }
}

export default CartTr;