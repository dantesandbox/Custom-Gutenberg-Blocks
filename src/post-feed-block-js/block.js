/**
 * BLOCK: skywalker-blocks
*/

//  Import CSS.
import './editor.scss';
import './style.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const {
  InspectorControls,
  RichText
} = wp.editor;

const {
  ServerSideRender,
  PanelBody,
  SelectControl,
  RangeControl,
  TextControl,
  ToggleControl
} = wp.components;

const {
  Fragment,
} = wp.element;

registerBlockType( 'cgb/block-post-feed-block-js', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Post Feed Block JS' ), // Block title.
	icon: 'grid-view', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Skywalker Blocks' ),
		__( 'Post Feed Blocks JS' ),
    __( 'Post Feed JS'),
		__( 'Skywalker' ),
	],
  description: 'Display a grid of the most recent posts',

  attributes: {
    postsPerPage: {
      type:'number',
      default:3
    },
    postTypes: {
      type:'object',
    },
    selectedPostType: {
      type:'string'
    },
    paddingTop: {
      type:'boolean',
      default:true
    },
    paddingBottom: {
      type:'boolean',
      default:true
    },
    postDirection: {
      type:'string',
      default:'desc'
    },
    numColumns: {
      type:'number',
      default:3
    },
    container: {
      type:'string',
      default:''
    },
    sectionTitle: {
      type:'string',
      default:'Section Title'
    },
    alignment: {
      type:'string',
      default:'align-center'
    },

  },

	edit:( props ) => {
    // Grab All Registered Post Types
    if(!props.attributes.postTypes){
      wp.apiFetch({
        path: '/wp/v2/posts'
      }).then(postTypes => {

        props.setAttributes({
          postTypes: postTypes
        })

      });
    }

    let postData = [];
    let displayPosts;

    const posts = props.attributes.postTypes;


    for (let key in posts){
      if (posts.hasOwnProperty(key)) {
          postData.push({title:`${posts[key].title.rendered}`, excerpt:`${posts[key].excerpt.rendered}`});
      }
    }

    displayPosts = postData.map((element, index) => {

      return (
        <div key={index}>
          <h3>{element.title}</h3>
        </div>
      )

    });


    // Set current selected number of posts
    const updatePostsPerPage = (e) => {
      props.setAttributes( {
          postsPerPage: parseInt( e.target.value ),
      } )
    }

    //console.log(props.attributes);

    // Generate lists of post directions.  Pass to select field.


    const postDir = [
      {label: 'Descending', value:'desc'},
      {label: 'Asending', value:'asc'},
    ]

    // Block Alignment

   const blockAlignment = [
     {label: 'Left Align', value:'align-left'},
     {label: 'Center Align', value:'align-center'},
     {label: 'Right Align', value:'align-right'},
   ]

    const containerSizes = [
      {label: 'None', value:''},
      {label: 'Contain Small', value:'skywalker-container-800'},
      {label: 'Contain Large', value:'skywalker-container-1200'}
    ]



		return (
		  <Fragment>
        <InspectorControls>
        <PanelBody
                title={ __( 'Post Feed Settings' ) }
                initialOpen={ true }
            >
            <TextControl
               value={props.attributes.sectionTitle}
               onChange={sectionTitle => props.setAttributes({ sectionTitle: sectionTitle })}
               label="Section Title"
            />
            <SelectControl
              value={props.attributes.alignment}
              options={blockAlignment}
              onChange={alignment => props.setAttributes({ alignment: alignment })}
              label="Alignment"
            />
            <ToggleControl
                label="Padding Top"
                help={ props.attributes.paddingTop ? 'Has fixed background.' : 'No fixed background.' }
                checked={ props.attributes.paddingTop }
                onChange={paddingTop => props.setAttributes({ paddingTop: paddingTop })}
            />
            <ToggleControl
                label="Padding Bottom"
                help={ props.attributes.paddingBottom ? 'Has fixed background.' : 'No fixed background.' }
                checked={ props.attributes.paddingBottom }
                onChange={paddingBottom => props.setAttributes({ paddingBottom: paddingBottom })}
            />
            <TextControl
                type="number"
                className="gbs-block-inspected-inspector-control-field"
                onChange={ updatePostsPerPage }
                value={ props.attributes.postsPerPage }
                label="Posts Per Page"
            />
            <SelectControl
              value={props.attributes.postDirection}
              className="gbs-block-inspected-inspector-control-field"
              options={postDir}
              onChange={postDirection => props.setAttributes({ postDirection: postDirection })}
              label="Post Direction"
            />
            <RangeControl
                 label={"Number Of Columns (" + props.attributes.numColumns  + ")" }
                 value={ props.attributes.numColumns }
                 onChange={numColumns => props.setAttributes({ numColumns: numColumns })}
                 min={ 1 }
                 max={ 4 }
                 step={ 1 }
             />
             <SelectControl
               label='Block Container'
               value={props.attributes.container}
               options={containerSizes}
               onChange={container => props.setAttributes({ container: container })}
             />
            </PanelBody>
        </InspectorControls>
        <div key="2" className={props.className}>
          {displayPosts}
        </div>
      </Fragment>
		);
	},

	save: (props) => {

    let postData = [];
    let displayPosts;

    const posts = props.attributes.postTypes;


    for (let key in posts){
      if (posts.hasOwnProperty(key)) {
          postData.push({title:`${posts[key].title.rendered}`, excerpt:`${posts[key].excerpt.rendered}`});
      }
    }

    displayPosts = postData.map((element, index) => {
      return (
        <div key={index}>
          <h3>{element.title}</h3>
        </div>
      )

    });

     return (
       <div key="2" className={props.className}>
         {displayPosts}
       </div>
     )

  },
});
