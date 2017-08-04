<?php $contact = Disciple_Tools_Contacts::get_contact( get_the_ID(), true ); ?>
<?php $contact_fields = Disciple_Tools_Contacts::get_contact_fields(); ?>

<section class="test-flex bordered-box"
         style="position:fixed; top:100px; bottom:20px; display:flex; flex-direction:column; width:30%">
    <div>
        <div class="contact-quick-buttons">
            <?php foreach( $contact_fields as $field => $val ){
                if ( strpos( $field, "contact_quick_button" ) === 0){
                    $current_value = 0;
                    if ( isset( $contact->fields[$field] ) ){
                        $current_value = $contact->fields[$field];
                    }?>

            <button class="contact-quick-button" id="<?php echo $field ?>"
                    onclick="save_contact_field(<?php echo get_the_ID() ?>, '<?php echo $field?>', <?php echo $current_value + 1?>)">
                <img src="<?php echo get_template_directory_uri() . "/assets/images/" . $val['icon'] ?>">
                <span class="contact-quick-button-number"><?php echo $current_value ?></span>
                <p><?php echo $val["name"] ?></p>
            </button>
            <?php }}
            ?>

        </div>
    </div>
    <div>
        <textarea id="comment-input"></textarea>

        <button class="button" onclick="post_comment( <?php echo get_the_ID()?>)">Add</button>
    </div>
    <div>
            <a>Activity / </a>
            <a>Comments</a>
            <br>
    </div>
    <div style="overflow-y:scroll" id="comments-wrapper" onload="get_contacts(<?php echo get_the_ID()?>)">

    </div>
</section>
