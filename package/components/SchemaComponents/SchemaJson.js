import React, { Component, PureComponent } from "react";
import {
  Dropdown,
  Menu,
  Row,
  Col,
  Select,
  Checkbox,
  Icon,
  Input,
  message,
  Tooltip,
} from "antd";
import FieldInput from "./FieldInput";

const Option = Select.Option;
import "./schemaJson.css";
import _ from "underscore";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { JSONPATH_JOIN_CHAR, SCHEMA_TYPE } from "../../utils";
import LocaleProvider from "../LocalProvider/index";
import MockSelect from "../MockSelect/index";

const mapping = (name, data, showEdit, showAdv) => {
  switch (data.type) {
    case "array":
      return (
        <SchemaArray
          prefix={name}
          data={data}
          showEdit={showEdit}
          showAdv={showAdv}
        />
      );
      break;
    case "object":
      let nameArray = [].concat(name, "properties");
      return (
        <SchemaObject
          prefix={nameArray}
          data={data}
          showEdit={showEdit}
          showAdv={showAdv}
        />
      );
      break;
    default:
      return null;
  }
};

class SchemaArray extends PureComponent {
  constructor(props, context) {
    super(props);
    this._tagPaddingLeftStyle = {};
    this.Model = context.Model.schema;
  }

  componentWillMount() {
    const { prefix } = this.props;
    let length = prefix.filter((name) => name != "properties").length;
    this.__tagPaddingLeftStyle = {
      paddingLeft: `${20 * (length + 1)}px`,
    };
  }

  getPrefix() {
    return [].concat(this.props.prefix, "items");
  }

  handleChangeType = (value) => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, "type");
    this.Model.changeTypeAction({ key, value });
  };

  handleChangeDesc = (e) => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `description`);
    let value = e.target.value;
    this.Model.changeValueAction({ key, value });
  };

  handleChangeMock = (e) => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `mock`);
    let value = e ? { mock: e } : "";
    this.Model.changeValueAction({ key, value });
  };

  handleChangeTitle = (e) => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `title`);
    let value = e.target.value;
    this.Model.changeValueAction({ key, value });
  };

  handleAddChildField = () => {
    let prefix = this.getPrefix();
    let keyArr = [].concat(prefix, "properties");
    this.Model.addChildFieldAction({ key: keyArr });
    this.Model.setOpenValueAction({ key: keyArr, value: true });
  };

  handleClickIcon = () => {
    let prefix = this.getPrefix();
    let keyArr = [].concat(prefix, "properties");
    this.Model.setOpenValueAction({ key: keyArr });
  };

  handleShowEdit = (name, type) => {
    let prefix = this.getPrefix();
    this.props.showEdit(prefix, name, this.props.data.items[name], type);
  };

  handleShowAdv = () => {
    this.props.showAdv(this.getPrefix(), this.props.data.items);
  };

  render() {
    const { data, prefix, showEdit, showAdv } = this.props;
    const items = data.items;
    let prefixArray = [].concat(prefix, "items");

    let prefixArrayStr = []
      .concat(prefixArray, "properties")
      .join(JSONPATH_JOIN_CHAR);
    let showIcon = this.context.getOpenValue([prefixArrayStr]);
    return (
      !_.isUndefined(data.items) && (
        <div className="array-type">
          <Row
            className="array-item-type"
            type="flex"
            justify="space-around"
            align="middle"
          >
            <Col
              span={8}
              className="col-item name-item col-item-name"
              style={this.__tagPaddingLeftStyle}
            >
              <Row type="flex" justify="space-around" align="middle">
                <Col span={2} className="down-style-col">
                  {items.type === "object" ? (
                    <span className="down-style" onClick={this.handleClickIcon}>
                      {showIcon ? (
                        <Icon className="icon-object" type="caret-down" />
                      ) : (
                        <Icon className="icon-object" type="caret-right" />
                      )}
                    </span>
                  ) : null}
                </Col>
                <Col span={22}>
                  <Input
                    addonAfter={<Checkbox disabled />}
                    disabled
                    value="Items"
                  />
                </Col>
              </Row>
            </Col>
            <Col span={3} className="col-item col-item-type">
              <Select
                name="itemtype"
                className="type-select-style"
                onChange={this.handleChangeType}
                value={items.type}
                getPopupContainer={(triggerNode) =>
                  this.props.popupContainer || triggerNode.parentElement
                }
              >
                {SCHEMA_TYPE.map((item, index) => {
                  return (
                    <Option value={item} key={index}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Col>
            {this.context.isMock && (
              <Col span={3} className="col-item col-item-mock">
                <MockSelect
                  schema={items}
                  showEdit={() => this.handleShowEdit("mock", items.type)}
                  onChange={this.handleChangeMock}
                />
              </Col>
            )}
            <Col
              span={this.context.isMock ? 4 : 5}
              className="col-item col-item-mock"
            >
              <Input
                addonAfter={
                  <Icon
                    type="edit"
                    onClick={() => this.handleShowEdit("title")}
                  />
                }
                placeholder={LocaleProvider("title")}
                value={items.title}
                onChange={this.handleChangeTitle}
              />
            </Col>
            <Col
              span={this.context.isMock ? 4 : 5}
              className="col-item col-item-desc"
            >
              <Input
                addonAfter={
                  <Icon
                    type="edit"
                    onClick={() => this.handleShowEdit("description")}
                  />
                }
                placeholder={LocaleProvider("description")}
                value={items.description}
                onChange={this.handleChangeDesc}
              />
            </Col>
            <Col
              span={this.context.isMock ? 2 : 3}
              className="col-item col-item-setting"
            >
              {items.type != "object" && items.type != "boolean" && (
                <span className="adv-set" onClick={this.handleShowAdv}>
                  <Tooltip
                    placement="top"
                    title={LocaleProvider("adv_setting")}
                    getPopupContainer={(triggerNode) =>
                      this.props.popupContainer || triggerNode.parentElement
                    }
                  >
                    <Icon type="setting" />
                  </Tooltip>
                </span>
              )}

              {items.type === "object" ? (
                <span onClick={this.handleAddChildField}>
                  <Tooltip
                    placement="top"
                    title={LocaleProvider("add_child_node")}
                    getPopupContainer={(triggerNode) =>
                      this.props.popupContainer || triggerNode.parentElement
                    }
                  >
                    <Icon type="plus" className="plus" />
                  </Tooltip>
                </span>
              ) : null}
            </Col>
          </Row>
          <div className="option-formStyle">
            {mapping(prefixArray, items, showEdit, showAdv)}
          </div>
        </div>
      )
    );
  }
}

SchemaArray.contextTypes = {
  getOpenValue: PropTypes.func,
  Model: PropTypes.object,
  isMock: PropTypes.bool,
};

class SchemaItem extends PureComponent {
  constructor(props, context) {
    super(props);
    this._tagPaddingLeftStyle = {};
    this.Model = context.Model.schema;
  }

  componentWillMount() {
    const { prefix } = this.props;
    let length = prefix.filter((name) => name != "properties").length;
    this.__tagPaddingLeftStyle = {
      paddingLeft: `${20 * (length + 1)}px`,
    };
  }

  getPrefix() {
    return [].concat(this.props.prefix, this.props.name);
  }

  handleChangeName = (e) => {
    const { data, prefix, name } = this.props;
    let value = e.target.value;

    if (data.properties[value] && typeof data.properties[value] === "object") {
      return message.error(`The field "${value}" already exists.`);
    }

    this.Model.changeNameAction({ value, prefix, name });
  };

  handleChangeDesc = (e) => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, "description");
    let value = e.target.value;
    this.Model.changeValueAction({ key, value });
  };

  handleChangeMock = (e) => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `mock`);
    let value = e ? { mock: e } : "";
    this.Model.changeValueAction({ key, value });
  };

  handleChangeTitle = (e) => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `title`);
    let value = e.target.value;
    this.Model.changeValueAction({ key, value });
  };

  handleChangeType = (e) => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, "type");
    this.Model.changeTypeAction({ key, value: e });
  };

  handleDeleteItem = () => {
    const { prefix, name } = this.props;
    let nameArray = this.getPrefix();
    this.Model.deleteItemAction({ key: nameArray });
    this.Model.enableRequireAction({ prefix, name, required: false });
  };

  handleShowEdit = (editorName, type) => {
    const { data, name, showEdit } = this.props;

    showEdit(
      this.getPrefix(),
      editorName,
      data.properties[name][editorName],
      type
    );
  };

  handleShowAdv = () => {
    const { data, name, showAdv } = this.props;
    showAdv(this.getPrefix(), data.properties[name]);
  };

  handleAddField = () => {
    const { prefix, name } = this.props;
    this.Model.addFieldAction({ prefix, name });
  };

  handleClickIcon = () => {
    let prefix = this.getPrefix();
    let keyArr = [].concat(prefix, "properties");
    this.Model.setOpenValueAction({ key: keyArr });
  };

  handleEnableRequire = (e) => {
    const { prefix, name } = this.props;
    let required = e.target.checked;
    this.Model.enableRequireAction({ prefix, name, required });
  };

  render() {
    let { name, data, prefix, showEdit, showAdv } = this.props;
    let value = data.properties[name];
    let prefixArray = [].concat(prefix, name);

    let prefixStr = prefix.join(JSONPATH_JOIN_CHAR);
    let prefixArrayStr = []
      .concat(prefixArray, "properties")
      .join(JSONPATH_JOIN_CHAR);
    let show = this.context.getOpenValue([prefixStr]);
    let showIcon = this.context.getOpenValue([prefixArrayStr]);
    return show ? (
      <div>
        <Row type="flex" justify="space-around" align="middle">
          <Col
            span={8}
            className="col-item name-item col-item-name"
            style={this.__tagPaddingLeftStyle}
          >
            <Row type="flex" justify="space-around" align="middle">
              <Col span={2} className="down-style-col">
                {value.type === "object" ? (
                  <span className="down-style" onClick={this.handleClickIcon}>
                    {showIcon ? (
                      <Icon className="icon-object" type="caret-down" />
                    ) : (
                      <Icon className="icon-object" type="caret-right" />
                    )}
                  </span>
                ) : null}
              </Col>
              <Col span={22}>
                <FieldInput
                  addonAfter={
                    <Tooltip
                      placement="top"
                      title={LocaleProvider("required")}
                      getPopupContainer={(triggerNode) =>
                        this.props.popupContainer || triggerNode.parentElement
                      }
                    >
                      <Checkbox
                        onChange={this.handleEnableRequire}
                        checked={
                          _.isUndefined(data.required)
                            ? false
                            : data.required.indexOf(name) != -1
                        }
                      />
                    </Tooltip>
                  }
                  onChange={this.handleChangeName}
                  value={name}
                />
              </Col>
            </Row>
          </Col>

          <Col span={3} className="col-item col-item-type">
            <Select
              className="type-select-style"
              onChange={this.handleChangeType}
              value={value.type}
              getPopupContainer={(triggerNode) =>
                this.props.popupContainer || triggerNode.parentElement
              }
            >
              {SCHEMA_TYPE.map((item, index) => {
                return (
                  <Option value={item} key={index}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Col>

          {this.context.isMock && (
            <Col span={3} className="col-item col-item-mock">
              <MockSelect
                schema={value}
                showEdit={() => this.handleShowEdit("mock", value.type)}
                onChange={this.handleChangeMock}
              />
            </Col>
          )}

          <Col
            span={this.context.isMock ? 4 : 5}
            className="col-item col-item-mock"
          >
            <Input
              addonAfter={
                <Icon
                  type="edit"
                  onClick={() => this.handleShowEdit("title")}
                />
              }
              placeholder={LocaleProvider("title")}
              value={value.title}
              onChange={this.handleChangeTitle}
            />
          </Col>

          <Col
            span={this.context.isMock ? 4 : 5}
            className="col-item col-item-desc"
          >
            <Input
              addonAfter={
                <Icon
                  type="edit"
                  onClick={() => this.handleShowEdit("description")}
                />
              }
              placeholder={LocaleProvider("description")}
              value={value.description}
              onChange={this.handleChangeDesc}
            />
          </Col>

          <Col
            span={this.context.isMock ? 2 : 3}
            className="col-item col-item-setting"
          >
            {value.type != "object" && value.type != "boolean" && (
              <span className="adv-set" onClick={this.handleShowAdv}>
                <Tooltip
                  placement="top"
                  title={LocaleProvider("adv_setting")}
                  getPopupContainer={(triggerNode) =>
                    this.props.popupContainer || triggerNode.parentElement
                  }
                >
                  <Icon type="setting" />
                </Tooltip>
              </span>
            )}
            <span className="delete-item" onClick={this.handleDeleteItem}>
              <Icon type="close" className="close" />
            </span>
            {value.type === "object" ? (
              <DropPlus prefix={prefix} name={name} />
            ) : (
              <span onClick={this.handleAddField}>
                <Tooltip
                  placement="top"
                  title={LocaleProvider("add_sibling_node")}
                  getPopupContainer={(triggerNode) =>
                    this.props.popupContainer || triggerNode.parentElement
                  }
                >
                  <Icon type="plus" className="plus" />
                </Tooltip>
              </span>
            )}
          </Col>
        </Row>
        <div className="option-formStyle">
          {mapping(prefixArray, value, showEdit, showAdv)}
        </div>
      </div>
    ) : null;
  }
}

SchemaItem.contextTypes = {
  getOpenValue: PropTypes.func,
  Model: PropTypes.object,
  isMock: PropTypes.bool,
};

class SchemaObjectComponent extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      _.isEqual(nextProps.data, this.props.data) &&
      _.isEqual(nextProps.prefix, this.props.prefix) &&
      _.isEqual(nextProps.open, this.props.open)
    ) {
      return false;
    }
    return true;
  }

  render() {
    const { data, prefix, showEdit, showAdv } = this.props;
    return (
      <div className="object-style">
        {Object.keys(data.properties).map((name, index) => (
          <SchemaItem
            key={index}
            data={this.props.data}
            name={name}
            prefix={prefix}
            showEdit={showEdit}
            showAdv={showAdv}
          />
        ))}
      </div>
    );
  }
}

const SchemaObject = connect((state) => ({
  open: state.schema.open,
}))(SchemaObjectComponent);

const DropPlus = (props, context) => {
  const { prefix, name, add } = props;
  const Model = context.Model.schema;
  const menu = (
    <Menu>
      <Menu.Item>
        <span onClick={() => Model.addFieldAction({ prefix, name })}>
          {LocaleProvider("sibling_node")}
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={() => {
            Model.setOpenValueAction({
              key: [].concat(prefix, name, "properties"),
              value: true,
            });
            Model.addChildFieldAction({
              key: [].concat(prefix, name, "properties"),
            });
          }}
        >
          {LocaleProvider("child_node")}
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Tooltip
      placement="top"
      title={LocaleProvider("add_node")}
      getPopupContainer={(triggerNode) =>
        this.props.popupContainer || triggerNode.parentElement
      }
    >
      <Dropdown overlay={menu}>
        <Icon type="plus" className="plus" />
      </Dropdown>
    </Tooltip>
  );
};

DropPlus.contextTypes = {
  Model: PropTypes.object,
};

const SchemaJson = (props) => {
  const item = mapping([], props.data, props.showEdit, props.showAdv);
  return <div className="schema-content">{item}</div>;
};

export default SchemaJson;
